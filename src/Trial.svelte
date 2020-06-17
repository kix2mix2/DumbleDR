<script>
    import { projections, data, pos_count, neg_count, hover, images, vis_type, ready, progress, colorScale } from "./stores.js";
    import { debounce } from "lodash";
	import { flip } from 'svelte/animate';
    import { quintOut } from 'svelte/easing';
    import { scale, fade } from "svelte/transition";
    import Vis from "./Vis.svelte";
    import Star from "./Star.svelte";
    
    let width = 250;
    let height = 250;
    let margin = 20;
    export let tooltip;

    $: classes = Array.from(new Set($projections[0].map(d => d.class)))
    let available_points = new Array(15).fill(false)

    function update(c) {
        available_points = available_points.map((_, i) => i < $pos_count);
    }
    $: update($pos_count);


</script>
<section>
    <header>
        <span>show datapoints as: </span>
        <input type="radio" bind:group={$vis_type} value="image"> Image
        <input type="radio" bind:group={$vis_type} value="circle"> Circles<br>
        <!-- <span>available points: </span><span class="mdi mdi-thumb-up"></span><span style="color: green;">{$pos_count}</span>
        <span class="mdi mdi-thumb-down"></span><span style="color: orangered;">{$neg_count}</span><br> -->
        available points: {#each available_points as a}
            <span class="mdi" class:mdi-heart={a} class:mdi-heart-outline={!a}></span>
        {/each}
        <br>
        <button on:click={() => data.sort_by_pos()}><span class="mdi mdi-sort"></span> Sort</button>
        {#if $vis_type == "circle"}
            <small style="display: flex; justify-content: center;">
                {#each classes as c}
                    <div transition:fade style="display: inline-block; padding: 0px .4rem;"><span style="color: {$colorScale(c)}">⚫</span> {c}</div>
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
        padding: 0.8rem 0px;
        margin-top: 0.8rem;
    }



</style>