<svelte:head>
    <link href="https://cdn.jsdelivr.net/gh/jspsych/jsPsych@6.1.0/css/jspsych.min.css" rel="stylesheet" type="text/css">
    <link href="./build/style.css" rel="stylesheet" type="text/css">
    <link href="./build/jspsych.css" rel="stylesheet" type="text/css">
</svelte:head>

<script>

    //import settings from "./settings.json";

	import { onMount } from 'svelte';
    import { scale } from "svelte/transition";

    import { color_time, image_time, sort_time, dataset, data, hover, images, projections, ready } from "./stores.js";
    import Vis from "./Vis.svelte";
    import Trial from "./Trial.svelte";

    import "jspsych";
    import "jspsych/plugins/jspsych-html-keyboard-response";
    import "jspsych/plugins/jspsych-html-button-response";
    import "jspsych/plugins/jspsych-survey-text.js";
    import "jspsych/plugins/jspsych-instructions.js"
    import "./jspsych-survey-multi-choice.js";

    import WeightedList from "js-weighted-list";
    //console.log(WeightedList)

    import {dr_explain, ui, rule_1, rule_3, sort, color, welcome, consent_form, time_text} from "./instructions.js";

    //const paths = settings.settings[0].paths;

    const rows = 2;
    const cols = 4;

    let subject_id = jsPsych.randomization.randomID(15);
    jsPsych.data.addProperties({
        subject: subject_id

    });
    
    let welcome_block = {
        type: "html-button-response",
        stimulus: welcome,
        choices: ['Start Study'],
        prompt: "<br><br>"
    };

    let consent = {
        type: "html-button-response",
        stimulus: consent_form,
        choices: ['I accept!'],
        prompt: "<br><br>"
    };

    let instructions = {
        type:'instructions',
        pages: [dr_explain, ui, rule_1,rule_3, sort, color, time_text],
        show_clickable_nav: true,
        show_page_number: true
    };

    var name = {
        type: 'survey-text',
        questions: [
            {
                prompt: '<div class=\"text-block\">Do you want to share your name or email with us? <br> ' +
                    'This is only so we can contact you in case we have questions about your user experience and will not be published anywhere. <br>' +
                    'Leave the input field empty if you don\'t want to be contacted any further. </div>',
                columns: 100,  
                name: 'Name'
            },
        ],
        randomize_question_order: false,
        prompt: "<br><br>"
    };

    var experience = {
        type: 'survey-multi-choice',
        questions: [
            {
                prompt: "<div class='text-block'> <b>What is the highest academic degree you graduated from? </b></div>",
                options: ['High School', 'Bachelor','Master','PhD','Other'],
                horizontal: true,
                required: true,
                name: 'degree'
            },
            {
                prompt: "<div class='text-block'> <b>Where do you primarily work? </b></div>",
                options: ['Research / Academia', 'Research / Other','Analysis/STEM work', 'Student','None of the above','Prefer not to say'],
                horizontal: true,
                required: true,
                name: 'job'
            },
            {
                prompt: "<div class='text-block'> <b>What is your experience with Machine Learning?</b></div>",
                options: ["Never heard of this", "I know the basics", "I use it in my work", "I work in the field", "I'm an expert in the field", "Prefer not to say"],
                horizontal: true,
                required: true,
                name: 'ML'
            },
            {
                prompt: "<div class='text-block'> <b>What is your experience with Information Visualization?</b></div>",
                options: ["Never heard of this", "I know the basics", "I use it in my work", "I work in the field", "I'm an expert in the field", "Prefer not to say"],
                horizontal: true,
                required: true,
                name: 'infovis'
            },
            {
                prompt: "<div class='text-block'> <b>What is your experience with Dimensionality Reduction?</b></div>",
                options: ["Never heard of this", "I know the basics", "I use it in my work", "I propose/research DR techniques", "Prefer not to say"],
                horizontal: true,
                required: true,
                name: 'dr'
            },
            {
                prompt: "<div class='text-block'> <b>Have you analysed scatterplots before?</b></div>",
                options: ["Never", "Yes, but only informally (in newspapers, social media etc.)", "I made scatterplots before with my own data", "I'm an expert when it comes to scatterplots", "Prefer not to say"],
                horizontal: true,
                required: true,
                name: 'scatter'
            }
        ]
    };

    let step = null;



    const client = stitch.Stitch.initializeDefaultAppClient('dumbledr-qfkje');
    const db = client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db("dumbledr");
    const results = db.collection("results");
    const settings_collection = db.collection("settings");

    let settings// = settings_collection.findOne({}).then(d => settings = d.settings);

    client.auth.loginWithCredential(new stitch.AnonymousCredential())
        .then(user => settings_collection.findOne({}))
        .catch(err => console.error(err))
        .then(d => settings = d.settings);

    // console.log(settings);
    $: console.log(settings)

    var counts = 1;
    let choosen_dataset;
    let choosen_projections;

    let dr_grid = {
        type: "html-button-response",
        stimulus: () => {

            const wl1 = new WeightedList(settings.map((s, i) => [i, 1 / (1 ** s.dataset_weight), s]));
            console.log(wl1);
            choosen_dataset = wl1.peek()[0];
            const sample1 = choosen_dataset.data;

            const wl = new WeightedList(sample1.paths.map((s, i) => [i, 1 / (1 ** sample1.path_weights[i]), s]));
            choosen_projections = wl.peek(rows * cols);
            const sample = choosen_projections.map(d => d.data);

            var dataset = sample1.name;
            data.load(data, sample, dataset);
            step = "dr_grid";

            return "<p class='description'>" + sample1.description + "</p>"
        },
        choices: ['Rating complete!'],
        timing_post_trial: 400,
        on_finish: function(data) {
            let update = {}
            update[`settings.${choosen_dataset.key}.dataset_weight`] = 1;
            client.auth.loginWithCredential(new stitch.AnonymousCredential())
                    .then(user => settings_collection.updateOne({}, {$inc: update}, { upsert : true }))
                    .catch(err => console.error(err))
                    .then(() => {
                        let update = {};
                        for (let i = 0, n = choosen_projections.length; i < n; ++i) {
                            update[`settings.${choosen_dataset.key}.path_weights.${choosen_projections[i].key}`] = 1;                
                        }
                        client.auth.loginWithCredential(new stitch.AnonymousCredential())
                            .then(user => settings_collection.updateOne({}, {$inc: update}, { upsert : true }))
                            .catch(err => console.error(err))
                            .then(() => {
                                client.auth.loginWithCredential(new stitch.AnonymousCredential())
                                    .then(user => settings_collection.findOne({}))
                                    .catch(err => console.error(err))
                                    .then(d => settings = d.settings);
                            });
                    });

            /* update = {}
            for (let i = 0, n = choosen_projections.length; i < n; ++i) {
                update[`settings.${choosen_dataset.key}.path_weights.${choosen_projections[i].key}`] = 1;                
            }
            client.auth.loginWithCredential(new stitch.AnonymousCredential())
                .then(user => settings_collection.updateOne({}, {$inc: update}, { upsert : true }))
                .catch(err => console.error(err)); */

            /* client.auth.loginWithCredential(new stitch.AnonymousCredential())
                .then(user => settings_collection.findOne({}))
                .catch(err => console.error(err))
                .then(d => settings = d.settings); */

            data.sort_time = $sort_time;
            data.color_time = $color_time;
            data.image_time = $image_time;
            data.finish_time = performance.now();
            data.dataset = $projections.map(p => {
                return {
                    "name": p.name,
                    "pos": p.pos_count,
                    "neg": p.neg_count,
                    "comment": p.comment,
                    "position": p.position,
                    "click_enlarge": p.click_enlarge,
                    "star_time": p.star_time
                }
            });
            step = 'debrief'
        }
    };

    let trial_feedback = {
        type: 'survey-multi-choice',
        questions: [
            {
                prompt: "<div class='text-block'> <b>How difficult was this trial? </b></div>",
                options: ['Very Easy', 'Easy', 'Medium', 'Hard', 'Very difficult', 'I was confused the entire time'],
                horizontal: true,
                required: false,
                name: 'difficulty'
            }
        ]
    };

    var trial_comment = {
        type: 'survey-text',
        questions: [
            {
                prompt: '<div class=\"text-block\">What criteria did you use for your ratings? (Answer only if the answer is different to before)</div>',
                columns: 80,
                rows: 5,
                required: false,
                name: 'Name'
            },
        ],
        randomize_question_order: false,
        prompt: "<br><br>",
        on_finish: function() {
            step='progress';
        }
    };

    //
    var cont = {
        type: "html-button-response",
        stimulus: "Another round? <br> ",
        choices: ['Continue to advance <img src="./images/healthcare-and-medical.svg" alt="science" height="15px"> & <img src="./images/tech.svg" alt="technology" height="15px"> ! <img src="./images/trophy.svg" alt="" height="15px">', 'End experiment <img src="./images/emoji.svg" alt=":(" height="15px"> <img src="./images/smiley.svg" alt=":(" height="15px">'],
        prompt: "<br><br>"

    };



    var loop_node = {
        timeline: [dr_grid, trial_feedback, trial_comment,  cont],
        loop_function: function (data) {
                console.log(cont);


                if (data.values()[3].button_pressed === '0' && counts < 12) {
                    counts++;
                    //console.log(counts);
                    return true;
                } else {
                    step = "debrief";
                    return false;
                }
            }
    }

    var debrief = {
        type: 'survey-multi-choice',
        questions: [
            {
                prompt: "<div class='text-block'> <b>How difficult was the experiment as a whole? </b></div>",
                options: ['Very Easy', 'Easy', 'Medium', 'Hard', 'Very difficult', 'I was confused the entire time'],
                horizontal: true,
                required: true,
                name: 'difficulty'
            },
            {
                prompt: "<div class='text-block'> <b>Do you think you improved at doing the tasks over time?</b></div>",
                options: ['Yes', 'No', 'I don\'t know'],
                horizontal: true,
                required: true,
                name: 'learning'
            },
            {
                prompt: "<div class='text-block'> <b>Did you experience different degrees of difficulty based on the dataset?</b></div>",
                options: ['Yes', 'No', 'I don\'t know'],
                horizontal: true,
                required: true,
                name: 'learning'
            }
        ]
    };

    var comments = {
        type: 'survey-text',
        questions: [
            {
                prompt: '<div class=\"text-block\">Do you have any other comments or feedback? </div>',
                columns: 80,
                rows: 5, 
                required: true, 
                name: 'Name'
            },
        ],
        randomize_question_order: false,
        prompt: "<br><br>"
    };


    onMount(() => {
        jsPsych.init({
            display_element: 'task',
            exclusions: {
                min_width: 700,
                min_height: 400
            },
            on_trial_start: data => {
            },
            on_interaction_data_update: data => {
                //console.log(JSON.stringify(data))
            },
            show_progress_bar: true,
            auto_update_progress_bar: true,
            timeline: [welcome_block,
                consent,
                instructions,  experience,
                loop_node, debrief, comments, name],
            on_finish: function(D) {
                // record proportion correct as unstructured data
                // console.log('yo yo', D);
                step = "finish";
                client.auth.loginWithCredential(new stitch.AnonymousCredential())
                    .then(user =>
                        results.insertOne({owner_id: client.auth.user.id, result: jsPsych.data.get().values()})
                    ).catch(err => {
                        console.error(err)
                    });
                // jsPsych.data.displayData();
                // console.log(jsPsych.data.get().values());
            },
        });
    });

    let tooltip
</script>

<nav>
    <h2 style="display: inline-block;"><img src="./images/favicon.png" height="24px" alt="" /> DumbleDR</h2>
    <div style="float:right; padding: .5rem;">
        <img src="./images/visus.png" height="48px" alt="visus" />
        <img src="./images/logo-precise.png" height="48px" alt="precise" />
    </div>
</nav>
  
{#if $hover}
<div
    id="tooltip" 
    transition:scale={{duration: 350}}
    class="tooltip" 
    style="position: absolute; z-index: 10000; visibility: {$hover ? null : 'hidden'}; pointer-events: none" 
    bind:this={tooltip}>
    <div class="tooltiptext">
        <img src="{`data/${$dataset}/thumbnails/${$images[$hover]}.png`}" alt="{$hover}" width="60px" height="60px" />
    </div>
</div>
{/if}
<main id="task" style="max-width: {cols * 250 + (cols + 1) * 10}px;">
    {#if step == "dr_grid"}
        <div class='jspsych-display-element'>
        {#if $ready}
            <div>
                <Trial tooltip={tooltip}></Trial>  
            </div>
<!--            <p>Press <key>Enter</key> to continue.</p>      -->
        {:else}
            <div class="loader"></div>
            <center>Loading...</center>
        {/if}
        </div>
    {:else if step == "finish"}
        <div class='jspsych-display-element'>
            <p>Study had completed. Your participant ID is {subject_id}.</p>
            <p>If you ever want the data you provided to be deleted you may contact: cristina.morariu@visus.uni-stuttgart.de or
                datenschutz@uni-stuttgart.de by providing this ID. </p>
            <p>If you lose this ID, the data will no longer be identifiable to you.</p>

            <iframe src="https://giphy.com/embed/AOrThUuuOoDCg" width="480" height="285" frameBorder="0" class="giphy-embed" allowFullScreen style="margin: auto;" title="Dumbledore is pleased!"></iframe><p><a href="https://giphy.com/gifs/harry-potter-applause-AOrThUuuOoDCg">via GIPHY</a></p>
            <h1><span class="mdi mdi-spin mdi-arm-flex"></span>Lots of thanks!!<span class="mdi mdi-spin mdi-heart"></span></h1>
        </div>


    {:else if step == "debrief"}
        <div class='jspsych-display-element'>

        </div>
    {:else if step == "progress"}
        <div class='jspsych-display-element'>
        <p>You have done {counts} / 12 rounds.<br>*The experiment will end after 12 rounds, regardless of the choice.</p>
        </div>
    {/if}

</main>

<style>
    :global(body) {
        padding: 0;
        font-family: "Inter", sans-serif !important;
        position: relative;
    }

    :global(label) {
        display: initial;
        padding-left: .4em;
    }

    :global(p.survey-multi-choice) {
        float: left;
        margin: 0px 1em 0px 0px;
    }

    nav {
        background-color: #f0f0f0;
        padding: 0;
        margin: 0;
    }

    nav h2 {
        padding: 1rem;
        margin: 0;
    }

    main {
        margin: auto;
        text-align: center;
    }

    .tooltip {
        pointer-events: none;
        position: relative;
        display: inline-block;
    }

    .tooltip .tooltiptext {
        position: absolute;
        background-color: #fff;
        color: #fff;
        text-align: center;
        padding: 0;
        margin: 0;
        border-radius: 3px;
        border: 2px solid #333;
        width: 60px;
        height: 60px;
        bottom: 5px;
        left: 50%;
        margin-left: -30px;
    }

    .tooltip .tooltiptext img {
        border-radius: 3px;
    }

    .tooltip .tooltiptext::after {
        content: " ";
        position: absolute;
        top: 100%; /* At the bottom of the tooltip */
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #333 transparent transparent transparent;
    }

    .loader {
        font-size: 10px;
        margin: 50px auto;
        text-indent: -9999em;
        width: 11em;
        height: 11em;
        border-radius: 50%;
        background: lightgrey;
        background: -moz-linear-gradient(left, lightgrey 10%, rgba(161,161,161, 0) 42%);
        background: -webkit-linear-gradient(left, lightgrey 10%, rgba(161,161,161, 0) 42%);
        background: -o-linear-gradient(left, lightgrey 10%, rgba(161,161,161, 0) 42%);
        background: -ms-linear-gradient(left, lightgrey 10%, rgba(161,161,161, 0) 42%);
        background: linear-gradient(to right, lightgrey 10%, rgba(161,161,161, 0) 42%);
        position: relative;
        -webkit-animation: load3 1.4s infinite linear;
        animation: load3 1.4s infinite linear;
        -webkit-transform: translateZ(0);
        -ms-transform: translateZ(0);
        transform: translateZ(0);
    }

    .loader:before {
        width: 50%;
        height: 50%;
        background: white;
        border-radius: 100% 0 0 0;
        position: absolute;
        top: 0;
        left: 0;
        content: '';
    }

    .loader:after {
        background: white;
        width: 75%;
        height: 75%;
        border-radius: 50%;
        content: '';
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }

    @keyframes load3 {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .description {
        color: #333;
    }

    .jspsych-display-element {
        overflow: visible;
    }

    
</style>

