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

    // import "jspsych/plugins/jspsych-survey-multi-select.js";
    import "./jspsych-survey-multi-choice.js";



    const paths = settings.settings[0].paths;

    const rows = 2;
    const cols = 4;

    let subject_id = jsPsych.randomization.randomID(15);
    let condition_assignment = jsPsych.randomization.sampleWithoutReplacement(['conditionA', 'conditionB', 'conditionC'], 1)[0];
    let timeline = [];

    jsPsych.data.addProperties({
        subject: subject_id,
        condition: condition_assignment
    });
    
    let welcome_block = {
        type: "html-button-response",
        stimulus: "<div class=\"text-block\">" +
                "<h1>Call for participants</h1>\n" +
                "\t\t\t\t\t\t\t    <p>\n" +
                "\t\t\t\t\t\t\t\t\tThe VISUS Research Centre at University of Stuttgart is looking for online participants\n" +
                "\t\t\t\t\t\t\t\t\tfor a visualization and analysis study. </p>\n" +
                "                                 <p>\n" +
                "                                    We are applying algorithms that find similarities in images on a series of datasets and want to find out whether humans find the results good or bad.</p>\n" +
                "                                <p>\n" +
                "                                    The study consists of:\n" +
                "                                    <ul>\n" +
                "                                        <li>informed consent agreement,</li>\n" +
                "                                        <li>instructions for the task,</li>\n" +
                "                                        <li>a pre-participation survey that will assess your experience with this type of task,</li>\n" +
                "                                        <li>a series of trials where you are asked to analyse some scatterplots depicting the results of some Machine Learning algorithms and choose the best result.</li>\n" +
                "                                        <li>a post-trial survey, where we will ask you for feedback on the task.</li>\n" +
                "                                    </ul>\n" +
                "                                </p>\n" +
                "\n" +
                "                                <p>\n" +
                "                                    The requirements are:\n" +
                "                                    <ul>\n" +
                "                                        <li> You are at least 18 years old.</li>\n" +
                "                                        <li> You speak fluent English.</li>\n" +
                "                                        <li> Your screen-size is at least 800x600 pixels.</li>\n" +
                "                                        <li> You have some experience with data analysis tasks (e.g. analysing charts and extracting information from them).</li>\n" +
                "                                    </ul>\n" +
                "\n" +
                "                                </p>\n" +
                "\n" +
                "                                <p>\n" +
                "                                    The task is estimated to take between 30 minutes and 1 hour.\n" +
                "\n" +
                "                                </p>" +
                "<p>Press start to begin.</p></div>",
        choices: ['Start Study'],
        prompt: "<br><br>"
    };

    let consent = {
        type: "html-button-response",
        stimulus: "<div class=\"text-block\"><h1>We need your consent to proceed</h1>\n" +
                "                <hr>\n" +
                "                <div class=\"legal well\">\n" +
                "                    <p> Dear prospective participant, </p>\n" +
                "                    <p>\n" +
                "                        We would like to invite you to participate in the following study within the scope of the\n" +
                "                        research carried out at the Collaborative Research Center/Transregio 161 (SFB-TRR 161). </p>\n" +
                "                     <p>\n" +
                "                        In particular, we analyze the perception humans have of the results of various algorithms that seek to imitate human perception of similarity.\n" +
                "                    </p>\n" +
                "                    <p>\n" +
                "                        In the current study, „Evaluation of Dimensionality Reduction\n" +
                "                        Techniques for Image-based Data“, you will be required to analyse and select preferences\n" +
                "                        for a series of visualizations of algorithms applied on image data.\n" +
                "                    </p>\n" +
                "                    <p>\n" +
                "                        Detailed instructions will follow after this screen.\n" +
                "                    </p>\n" +
                "\n" +
                "                    <p>\n" +
                "                        <iframe src=\"./Consent.pdf\" style=\"width:80%; height:600px;\"\n" +
                "                            frameborder=\"0\"></iframe>\n" +
                "                    </p>\n" +
                "\n" +
                "                    <p>\n" +
                "                       By clicking 'I accept!', you are giving your informed consent to participate in this study. " +
                "                    </p>\n" +
                "                </div> <\div>",
        choices: ['I accept!'],
        prompt: "<br><br>"
    };

    let instructions = {
        type:'html-button-response',
        stimulus: "<div class=\"text-block\"> \n" +
                "\n" +
                "<h1>Dimensionality reduction on image-based datasets</h1>\n" +
                "<p>\n" +
                "This experiment aims at gathering data about what users consider to be “good” or “”bad/misleading” visualizations. \n" +
                "More specifically we are interested in finding out user preferences regarding <b>projections of dimensionality reduction algorithms</b>. \n" +
                "</p>\n" +
                "<br>\n" +
                "\n" +
                "<h3>What is Dimensionality Reduction?</h3>\n" +
                "<p>\n" +
                "Dimensionality reduction (DR) refers to algorithms that reduce the number of dimensions (features) in a dataset, with minimal information loss. In this study, the dataset consists of images, and the DR projection result is a set of 2D coordinates, one for each image. This result can be visualized in a scatterplot, where each point represents an image from the dataset. Below you can see an example. \n" +
                "</p>\n" +
                "<img class='instructions' src='./dr_example.png'>\n" +
                "<p>\n" +
                "A good DR technique reduces data by maintaining similarity between items. This means that if two images are very similar they should be plot close to each other. Different DR algorithms define similarity differently, and for this reason we have many different scatterplots with different DR results. \n" +
                "</p>\n" +
                "\n" +
                "<p>In this study, we want you to analyse a group of scatterplots depicting these projections and decide which ones are good, and which ones are bad. <b>You do not need to have any additional knowledge about DR!</b></p>\n" +
                "\n" +
                "<p>In the next page we will explain the user interface of the study.</p>\n" +
                "\n" +
                "</div>",
        choices: ['Continue'],
        prompt: "<br><br>"
    }

    let interface_explain = {
        type:'html-button-response',
        stimulus: "<div class=\"text-block\"> \n" +
                "\n" +
                "<h1>User Interface</h1>\n" +
                "<p>\n" +
                "We will rate your preferences on a dataset-by-dataset basis. Below you can see an example of what this dataset might be and how the interface looks like. In this case, the dataset consists of photographs of the same head captured from different angles. There are 8 scatterplots, each corresponding to a projection of a DR algorithm technique. \n" +
                "</p>\n" +
                "<br>\n" +
                "<img class='instructions' src='./grid_example.png'>\n" +
                "\n" +
                "<h3>Think of this as a game with the following rules:</h3>\n" +
                // "\n" +
                // "<p>1. Your job is to distribute 15 hearts/points across the 8 projections. You do not need to distribute all the hearts. </p>\n" +
                // "<p>2. Some projections might be bad (i.e. where points can be randomly scattered), or misleading (i.e. clusters forming when there should no be clusters), or they might have other issues that you identify.  If this is the case, please mark the projections as bad by selecting the crossed heart symbol. You may leave a comment to any scatterplot, good or bad, by clicking the text box.</p>\n" +
                // "<p>3. Each scatterplot can be enlarged for better analysis! You can also zoom in and hover over the points.</p>\n" +
                // "<p>4. After each rating, we recommend you to click the sort button, which will sort the scatterplots by your rating. We want you to really compare the projections and rate or re-rate so that the sorted list is arranged from best to worst. This is also the reason why you have a limited number of hearts to assign: we want to avoid someone rating everything 4-stars or everything with one stars. </p>\n" +
                // "<p>5. We have also implemented an additional view where we plot each image as a point. The points are color coded by class labels. This is an auxiliery view you may use to consolite your opinion of the projection. We do however advise you should make your decision based on the image view, as class labels might not always make sense. </p>\n" +
                // "\n" +
                // "\n" +
                "</div>",
        choices: ['Rule 1 & 2'],
        prompt: "<br><br>"
    };

    let rule_12 = {
        type:'html-button-response',
        stimulus: "<div class=\"text-block\"> \n" +
                "\n" +
                "<h1>User Interface</h1>\n" +
                "<h3>Rule 1:</h3>\n" +
                "\n" +
                "<p>Your job is to distribute 15 hearts/points across the 8 projections. You do not need to distribute all the hearts. </p>\n" +
                 "<h3>Rule 2:</h3>\n" +
                "<p>Some projections might be bad (i.e. where points can be randomly scattered), or misleading (i.e. clusters forming when there should no be clusters), or they might have other issues that you identify.  If this is the case, please mark the projections as bad by selecting the crossed heart symbol. You may leave a comment to any scatterplot, good or bad, by clicking the text box.</p>\n" +
                "<img class='instructions' src='./rule_1.gif'>" +
                "</div>",
        choices: ['Rule 3'],
        prompt: "<br><br>"
    };


    let rule_3 = {
        type:'html-button-response',
        stimulus: "<div class=\"text-block\"> \n" +
                "\n" +
                "<h1>User Interface</h1>\n" +
                "<h3>Rule 3:</h3>\n" +
                "\n" +
               "<p>Each scatterplot can be enlarged for better analysis! You can also zoom in and hover over the points.</p>\n" +
                "<img class='instructions' src='./rule_3.gif'>" +
                "</div>",
        choices: ['Rule 4'],
        prompt: "<br><br>"
    };

    let rule_sort = {
        type:'html-button-response',
        stimulus: "<div class=\"text-block\"> \n" +
                "\n" +
                "<h1>User Interface</h1>\n" +
                "<h3>Rule 4:</h3>\n" +
                "\n" +
               "<p>After each rating, we recommend you to click the sort button, which will sort the scatterplots by your rating. We want you to really compare the projections and rate or re-rate so that the sorted list is arranged from best to worst. This is also the reason why you have a limited number of hearts to assign: we want to avoid someone rating everything 4-stars or everything with one stars. </p>\n" +
                 "<img class='instructions' src='./sort.gif'>" +
                "</div>",
        choices: ['Rule 5'],
        prompt: "<br><br>"
    };

    let rule_color = {
        type:'html-button-response',
        stimulus: "<div class=\"text-block\"> \n" +
                "\n" +
                "<h1>User Interface</h1>\n" +
                "<h3>Final thing:</h3>\n" +
                "\n" +
                "<p>We have also implemented an additional view where we plot each image as a point. The points are color coded by class labels. This is an auxiliery view you may use to consolite your opinion of the projection. We do however advise you should make your decision based on the image view, as class labels might not always make sense. </p>\n" +
                 "<img class='instructions' src='./color_view.gif'>" +
                "</div>",
        choices: ['Continue'],
        prompt: "<br><br>"
    };

    let time = {
        type:'html-button-response',
        stimulus: "<div class=\"text-block\"> \n" +
                "\n" +
                "<h1>How long will this take?</h1>\n" +
                "<p> In total we have 10 datasets, consisting of collections of photos. " +
                "After each trial you will be asked if you want to continue.</p> " +
                "<p>If you say no, you will be directed to the final debrief questionairre. </p>"+
                "<p>However, it would be really nice if you solve 5 or more! in any case, we promise beer and/or chocolate for your help! </p>"+

                "</div>",
        choices: ["Alright, let's start!"],
        prompt: "<br><br>"
    };

    var name = {
    type: 'survey-text',
    questions: [
      {prompt: '<div class=\"text-block\">Type in here your name or email. <br> ' +
                  'This is only so we can contact you in case we have questions about your answers. <br>' +
                  'You may also just input a random name if you don\'t want to be contacted further.</div>' , columns: 100, required: true, name: 'Name'},
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
            prompt: "<div class='text-block'> <b>What is your experience with Machine Learning?</b></div>",
            options: ["Never heard of this", "I know the basics", "I work in the field", "I'm an expert in the field", "Prefer not to say"],
            horizontal: true,
            required: true,
            name: 'ML'
          },
          {
            prompt: "<div class='text-block'> <b>What is your experience with information Visualization?</b></div>",
            options: ["Never heard of this", "I know the basics", "I work in the field", "I'm an expert in the field", "Prefer not to say"],
            horizontal: true,
            required: true,
            name: 'infovis'
          },
                {
            prompt: "<div class='text-block'> <b>What is your experience with dimensionality reduction?</b></div>",
            options: ["Never heard of this", "I know the basics", "I use it in my work", "I propose/research DR techniques", "Prefer not to say"],
            horizontal: true,
            required: true,
            name: 'dr'
          },
          {
            prompt: "<div class='text-block'> <b>Have you analysed scatterplots before?</b></div>",
            options: ["Never", "Yes, but only informally (in newspapers, media etc.)", "I made a scatterplot before with my own data", "I'm an expert when it comes to scatterplots", "Prefer not to say"],
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
            return "<p>You may hover over the points, or zoom in and out particular scatterplots.</p>" + "<p class='description'>" + sample1.description + "</p>"
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

    timeline.push( welcome_block, consent,instructions,interface_explain,rule_12,rule_3,rule_sort,rule_color,time,name, experience,
            ...[0,1].map(() => dr_grid));




    var trial = {
    type: 'html-button-response',
    stimulus: 'Hello. This is in a loop. Press R to repeat this trial, or C to continue.',
    choices: ['Another Dataset','Finish Session']
  }

    var counts = 0
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



    // timeline.push(multi_choice_block, multi_choice_block_horizontal,dr_grid);


    onMount(() => {
        //data.load(data, rows * cols);
        //jsPsych = window.jsPsych

        jsPsych.init({
            display_element: 'task',
            exclusions: {
                min_width: 800,
                min_height: 600
            },
            on_trial_start: data => {
            },
            on_interaction_data_update: data => {
                console.log(JSON.stringify(data))
            },
            show_progress_bar: true,
            auto_update_progress_bar: true,
            timeline: [welcome_block, consent,
                instructions,interface_explain,rule_12,rule_3,
                rule_sort,rule_color,time,name,
                experience,
                loop_node, debrief, comments],
            on_finish: function() {
                // record proportion correct as unstructured data
                console.log('yo yo');
                step = "finish";
                // jsPsych.data.displayData();
                // console.log(JSON.stringify(jsPsych.data.get().json(true)));
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
            <iframe src="https://giphy.com/embed/AOrThUuuOoDCg" width="480" height="285" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/harry-potter-applause-AOrThUuuOoDCg">via GIPHY</a></p>
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

