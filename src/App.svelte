<svelte:head>
    <link href="https://cdn.jsdelivr.net/gh/jspsych/jsPsych@6.1.0/css/jspsych.min.css" rel="stylesheet" type="text/css">
    <link href="./build/style.css" rel="stylesheet" type="text/css">
    <link href="./build/jspsych.css" rel="stylesheet" type="text/css">
</svelte:head>

<script>
    import settings from "./settings.json";

	import { onMount } from 'svelte';
    import { scale } from "svelte/transition";

    import { data, hover, images, projections, ready } from "./stores.js";

    import Vis from "./Vis.svelte";
    import Trial from "./Trial.svelte";

    import "jspsych";

    import "jspsych/plugins/jspsych-html-keyboard-response";
    import "jspsych/plugins/jspsych-html-button-response";
    import "jspsych/plugins/jspsych-survey-text.js";
    import "jspsych/plugins/jspsych-instructions.js"

    // import "jspsych/plugins/jspsych-survey-multi-select.js";
    import "./jspsych-survey-multi-choice.js";
    import { dr_explain, ui, rule_1,rule_3, sort, color, welcome, consent_form, time_text} from "./instructions.js";

    const paths = settings.settings[0].paths;

    const rows = 2;
    const cols = 4;

    let subject_id = jsPsych.randomization.randomID(15);
    let condition_assignment = jsPsych.randomization.sampleWithoutReplacement(['conditionA', 'conditionB', 'conditionC'], 1)[0];

    jsPsych.data.addProperties({
        subject: subject_id,
        condition: condition_assignment
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
      {prompt: '<div class=\"text-block\">Type in here your name or email. <br> ' +
                  'This is only so we can contact you in case we have questions about your answers. <br>' +
                  'You may also leave the input field empty if you don\'t want to be contacted further.</div>' , columns: 100,  name: 'Name'},
    ],
    randomize_question_order: false,
        prompt: "<br><br>"
  };

    var experience = {
        type: 'survey-multi-choice',
        questions: [
          {
            prompt: "<div class='text-block'> <b>What is the most recent academic degree you graduated from? </b></div>",
            options: ['High School', 'Bachelor','Master','PhD','Other'],
            horizontal: true,
            required: true,
            name: 'degree'
          },
                {
            prompt: "<div class='text-block'> <b>Where do you primarily work? </b></div>",
            options: ['Research / Academia', 'Research / Other','Non-research related job','Student','None of the above','Prefer not to say'],
            horizontal: true,
            required: true,
            name: 'job'
          },
          {
            prompt: "<div class='text-block'> <b>What is your experience with Machine Learning?</b></div>",
            options: ["Never heard of this", "I know the basics", "I work in the field", "I'm an expert in the field", "Prefer not to say"],
            horizontal: true,
            required: true,
            name: 'ML'
          },
          {
            prompt: "<div class='text-block'> <b>What is your experience with Information Visualization?</b></div>",
            options: ["Never heard of this", "I know the basics", "I work in the field", "I'm an expert in the field", "Prefer not to say"],
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

    let dr_grid = {
        type: "html-button-response",
        stimulus: () => {
            const sample1 = jsPsych.randomization.sampleWithoutReplacement(settings.settings, 1)[0];
            const sample = jsPsych.randomization.sampleWithoutReplacement(sample1.paths, rows * cols);
            data.load(data, sample);
            step = "dr_grid";
            return "<p class='description'>" + sample1.description + "</p>"
        },
        //choices: jsPsych.ALL_KEYS,
        choices: ['Another Dataset','Finish Session'],
        // prompt: 'You may hover over the points, or zoom in and out particular scatterplots. Click continue when you are finished!',
        timing_post_trial: 400,
        on_finish: function(data) {
            data.dataset = $projections.map(p => {
                return {
                    "name": p.name,
                    "pos": p.pos_count,
                    "neg": p.neg_count,
                    "comment": p.comment,
                }
            });
        }
    }



    var counts = 0;
    var loop_node = {
    timeline: [dr_grid],
    loop_function: function(data){
        console.log(data.values()[0].button_pressed);
      if(data.values()[0].button_pressed == '0' && counts<10){
          counts++;
          console.log(counts);
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
            prompt: "<div class='text-block'> <b>How difficult was the task? </b></div>",
            options: ['Very Easy', 'Easy', 'Medium', 'Hard', 'Very difficult', 'I was confused the entire time'],
            horizontal: true,
            required: true,
            name: 'difficulty'
          },
          {
            prompt: "<div class='text-block'> <b>Did the task become easier over time?</b></div>",
            options: ['Yes', 'No', 'I don\'t know'],
            horizontal: true,
            required: true,
            name: 'learning'
          }
          ,
          {
            prompt: "<div class='text-block'> <b>Did you experience different degree of difficulty based on the dataset?</b></div>",
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
      {prompt: '<div class=\"text-block\">Do you have any other comments or feedback?.</div>' , columns: 100,rows: 5, required: true, name: 'Name'},
    ],
    randomize_question_order: false,
        prompt: "<br><br>"
  };



    onMount(() => {
        //data.load(data, rows * cols);
        //jsPsych = window.jsPsych
        const client = stitch.Stitch.initializeDefaultAppClient('dumbledr-qfkje');
        const db = client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db("dumbledr");
        const results = db.collection("results");

        jsPsych.init({
            display_element: 'task',
            exclusions: {
                min_width: 700,
                min_height: 400
            },
            on_trial_start: data => {
            },
            on_interaction_data_update: data => {
                console.log(JSON.stringify(data))
            },
            show_progress_bar: true,
            auto_update_progress_bar: true,
            timeline: [welcome_block, consent,
                instructions, name, experience,
                loop_node, debrief, comments],
            on_finish: function(D) {
                // record proportion correct as unstructured data
                console.log('yo yo', D);
                step = "finish";
                client.auth.loginWithCredential(new stitch.AnonymousCredential())
                    .then(user =>
                        results.insertOne({owner_id: client.auth.user.id, result: JSON.parse(JSON.stringify(jsPsych.data.get().json(true)))})
                    ).catch(err => {
                        console.error(err)
                    });
            },
        });
    })

    let tooltip
</script>

<nav>
    <h2>DumbleDR</h2>
    
</nav>
  
{#if $hover}
<div
    id="tooltip" 
    transition:scale={{duration: 350}}
    class="tooltip" 
    style="position: absolute; z-index: 10000; visibility: {$hover ? null : 'hidden'}; pointer-events: none" 
    bind:this={tooltip}>
    <div class="tooltiptext">
        <img src="{`data/thumbnails/size50/${$images[$hover]}.png`}" alt="{$hover}" width="60px" height="60px" />
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
            <iframe src="https://giphy.com/embed/AOrThUuuOoDCg" width="480" height="285" frameBorder="0" class="giphy-embed" allowFullScreen style="margin: auto;" title="Dumbledore is pleased!"></iframe><p><a href="https://giphy.com/gifs/harry-potter-applause-AOrThUuuOoDCg">via GIPHY</a></p>
            <h1><span class="mdi mdi-spin mdi-arm-flex"></span>Lots of thanks!!<span class="mdi mdi-spin mdi-heart"></span></h1>
        </div>


    {:else if step == "debrief"}
        <div class='jspsych-display-element'>

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
        background-color: #333;
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

