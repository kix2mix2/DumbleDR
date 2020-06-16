<svelte:head>
    <link href="https://cdn.jsdelivr.net/gh/jspsych/jsPsych@6.1.0/css/jspsych.min.css" rel="stylesheet" type="text/css">
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
        type: "html-keyboard-response",
        stimulus: "Welcome to the experiment. Press any key to begin.",
        choices: jsPsych.ALL_KEYS
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
        choices: ['Continue'],
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

    timeline.push(/* welcome_block, */ ...[0,1].map(() => dr_grid));


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
            timeline: timeline,
            on_finish: function() {
                // record proportion correct as unstructured data
                console.log('yo yo');
                step = "finish";
                console.log(JSON.stringify(jsPsych.data.get().json(true)));
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
            <h1><span class="mdi mdi-spin mdi-arm-flex"></span>THX!!<span class="mdi mdi-spin mdi-heart"></span></h1>
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

