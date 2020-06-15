<script>
    import { projections, data, pos_count, neg_count, hover, images, vis_type, ready, progress, colorScale } from "./stores.js";
    import { debounce } from "lodash";
	import { flip } from 'svelte/animate';
    import { quintOut } from 'svelte/easing';
    import { scale, fade } from "svelte/transition";
    import Vis from "./Vis.svelte";

    let width = 250;
    let height = 250;
    let margin = 20;
    export let tooltip;

    $: classes = Array.from(new Set($projections[0].map(d => d.class)))

</script>
<section>
    <header>
        <span>show datapoints as: </span>
        <input type="radio" bind:group={$vis_type} value="image"> Image
        <input type="radio" bind:group={$vis_type} value="circle"> Circles<br>
        <span>available points: </span><span class="mdi mdi-thumb-up"></span><span style="color: green;">{$pos_count}</span>
        <span class="mdi mdi-thumb-down"></span><span style="color: orangered;">{$neg_count}</span><br>
        <button on:click={() => data.sort_by_pos()}><span class="mdi mdi-sort"></span> Sort</button>
        {#if $vis_type == "circle"}
            <small>
                {#each classes as c}
                    <div transition:fade><span style="color: {$colorScale(c)}">•</span> {c}</div>
                {/each}
            </small>
        {/if}
    </header>
    <div class="vis_list">
        {#if $ready}
            {#each $projections as p, i (p)}
            <div   
                style="margin: 0px;"
                animate:flip={{duration: 650, easing: quintOut}}>
                <!-- on:mouseleave={() => debounce(() => data.sort_by_pos(), 650)()} -->
                <Vis 
                    tooltip={tooltip}
                    data={p}
                    width={width}
                    height={height}
                    margin={margin}>
                </Vis>
            </div>
            {/each}
        {/if}
    </div>
</section>

<style>
    .vis_list {
        display: flex;
        flex-wrap: wrap;
        position: relative;
    }

    header {
        border-top: 1px solid lightgrey;
        border-bottom: 1px solid lightgrey;
    }



</style>