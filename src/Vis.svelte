<script>
    import { onMount } from "svelte"
    import { scale, fly } from "svelte/transition"
    import { dataset, images, colorScale, bgScale, hover, data as D, pos_count, neg_count, vis_type } from "./stores.js";
    import * as d3 from "d3";
    import { Delaunay } from "d3-delaunay";import { createEventDispatcher } from 'svelte';


	const dispatch = createEventDispatcher();

    import Name from "./Name.svelte";
    import Star from "./Star.svelte";

    export let data;
    export let width;
    export let height;
    export let margin;
    export let tooltip;
    export let button = true;
    
    //let prog = 0;

    $: image_elements = [];
    $: image_promises = image_elements.map((img,i) => {
        if (!img) return "done"
        return img.decode().then(() => image_promises[i] = "done").catch(() => image_promises[i] = "done")
    })
    $: prog = image_promises.reduce((a, b) => a + (b == "done" ? 1 : 0), 0) / image_promises.length;
    
    $: [x, y] = [d3.scaleLinear(), d3.scaleLinear()];
    $: voronoi = Delaunay.from(data, d => x(d.x), d => y(d.y)).voronoi([0, 0, Math.max(1,width || 1), Math.max(1, height || 1)])
    $: x.range([margin, width - margin])
    $: y.range([height - margin, margin])
    $: [x_domain, y_domain] = domains(data)
    $: x.domain(x_domain)
    $: y.domain(y_domain)

    function domains(data) {
        let [x_min, x_max] = d3.extent(data, d => d.x)
        let [y_min, y_max] = d3.extent(data, d => d.y)

        const x_span = x_max - x_min;
        const y_span = y_max - y_min;

        const o = Math.abs(x_span - y_span) / 2;
        if (x_span > y_span) {
            y_min -= o;
            y_max += o
        } else {
            x_min -= o;
            x_max += o;
        }

        return [[x_min, x_max], [y_min, y_max]];
    }

    let g;
    let g2;
    let zoom = d3.zoom()

    onMount(() => {
        d3.select(g).call(zoom.extent([[0, 0], [width, height]])
            .scaleExtent([1, 8])
            .on("zoom", zoomed))
        d3.select(g2).call(zoom.extent([[0, 0], [width * 3, height * 3]])
            .scaleExtent([1, 8])
            .on("zoom", zoomed))
    })

    function zoomed() {
        let {k, x, y} = d3.event.transform
        is_zoomed = !(k == 1 && x == 0 && y == 0);
        d3.select(this).attr("transform", d3.event.transform);
    } 

    let is_zoomed = false;
    let open_dialog = false;
    let dialog;

    function callbackFunction(event) {
        open_dialog = false;
    }

    $: big_size = Math.min(window.innerHeight, window.innerWidth) *.95 - 40; // -40 padding

    let comment_menu;
</script>

<div class="card" style="background-color: {$bgScale(-data.pos_count + data.neg_count)};">
    {#if prog != 1}
    <div id="progressbar" style="width: {width -10}px" out:fly>
        <div id="bar" style="width: {prog * 100}%;"></div>
    </div>
    {/if}
    <small style="position: absolute; top: 5px; right: 5px;" >
        <button 
            disabled={!is_zoomed}
            title="reset zoom"
            on:click={() => {
                d3.select(g)
                    .transition()
                    .duration(350)
                    .call(zoom.transform, d3.zoomIdentity)
        }}>
            <span class="mdi mdi-magnify-scan"></span>
        </button>
        {#if button}
        <button
            title="expand"
            on:click={() => {
                console.log(open_dialog)
                open_dialog = !open_dialog
            }}
            >
            <span class="mdi"
                class:mdi-arrow-expand={!open_dialog}
                class:mdi-arrow-collapse={open_dialog}></span>
        </button>
        {:else}
            <button on:click={() => dispatch("close")}><span class="mdi mdi-close"></span> Close</button>
        {/if}
    </small>
    <!-- <h5><Name string={data.name.slice(26).slice(0, -4)}></Name></h5> -->
    <svg 
        width={width} 
        height={height} 
        on:mouseleave={() => D.set_hover(null)}
        >
        <defs>
            <filter id="matrix">
                <feColorMatrix type="matrix" in="SourceGraphic" 
                    values="0.1 0 0 0 0
                            0 0.8 0 0 0
                            0 0 1.7 0 0
                            0 0 0 1 0 "/>
            </filter>
        </defs>
        <g bind:this={g}>
        {#each data as point, i}
            {#if voronoi.cellPolygon(i)}
                <path 
                    d={`M${voronoi.cellPolygon(i).join("L")}Z`}
                    fill="transparent"
                    on:mouseenter={(event) => {
                        D.set_hover(i)
                    }}
                    on:mousemove={(event) => {
                        const tooltip = document.getElementById("tooltip")
                        if (tooltip) {
                            tooltip.style.left = event.pageX + "px";
                            tooltip.style.top = event.pageY + "px";
                        }
                    }}
                    title={point.class}
                    >
                </path>
            {/if}
            <g transform={`translate(${x(point.x) - 10}, ${y(point.y) - 10})`}>
                {#if $vis_type == "image"}
                    <image 
                        bind:this={image_elements[i]}
                        style="pointer-events: none;"
                        href={`data/${$dataset}/thumbnails/${point.img}.png`}
                        width=20 height=20 
                        filter={i == $hover ? "url(#matrix)" : null} 
                        title={point.class}
                        >
                    </image>
                {:else if $vis_type == "circle"}
                    <circle
                        cx=10
                        cy=10
                        r={$hover == i ? 5 : 3}
                        fill={$hover == i ? $colorScale(point.class) : "none"}
                        stroke={$colorScale(point.class)}
                    ></circle>
                {/if}
            </g>
        {/each}
        {#if $vis_type == "image"}
        {#each data.filter((d, i) => $hover == i) as point, i}
            <g transform={`translate(${x(point.x) - 10}, ${y(point.y) - 10})`}>
                <image 
                    style="pointer-events: none;"
                    xlink:href={`data/${$dataset}/thumbnails/${point.img}.png`}
                    width=20 height=20 
                    filter="url(#matrix)"
                    title={point.class}
                    >
                </image>
            </g>
        {/each}
        {/if}
        </g>
    </svg>
    <div style="text-align: center;">
        <div style="text-align: left">  
            Rate:
            <Star bind:count={data.pos_count} bind:bad={data.neg_count} max={4}></Star>
        </div>
    </div>

    <small style="position: absolute; bottom: 0px; right: 5px;">
        <div class:active={comment_menu} class="dropdown" >
            <button on:click={() => comment_menu = true}>
                <span class="mdi mdi-comment-text-outline"></span>
            </button>
            <div class="comment dropdown-content">
                Comments:
                <button style="float:right;" on:click={() => comment_menu = false}><span class="mdi mdi-close" /></button>
                <textarea 
                    bind:value={data.comment} 
                    on:key={(event) => event.preventDefault()} />
            </div>
            
        </div>
    </small>

    {#if open_dialog}
    <div id="modal" class="modal">
        <div class="modal-content" style="width: fit-content;">
            <svelte:self 
                on:close="{callbackFunction}" 
                bind:data={data} 
                width={big_size} 
                height={big_size} 
                margin={margin} 
                tooltip={tooltip} 
                button={false}>
            </svelte:self>
        </div>
    </div>
    {/if}

    <!-- <div bind:this={dialog} class="modal" style="position: absolute; visibility: {open_dialog ? null : "hidden"}" transition:scale>
        <div>
            <svg 
                width={width * 3} 
                height={height * 3} 
                on:mouseleave={() => D.set_hover(null)}
                >
                <defs>
                    <filter id="matrix">
                        <feColorMatrix type="matrix" in="SourceGraphic" 
                            values="0.1 0 0 0 0
                                    0 0.8 0 0 0
                                    0 0 1.7 0 0
                                    0 0 0 1 0 "/>
                    </filter>
                </defs>
                <g bind:this={g2}>
                    {#each data as point, i}
                        {#if open_dialog}
                        {#if voronoi.cellPolygon(i)}
                            <path 
                                d={`M${voronoi.cellPolygon(i).map(d => d.map(d => d*3)).join("L")}Z`}
                                fill="transparent"
                                on:mouseenter={(event) => {
                                    D.set_hover(i)
                                }}
                                on:mousemove={(event) => {
                                    const tooltip = document.getElementById("tooltip")
                                    if (tooltip) {
                                        tooltip.style.left = event.pageX + "px";
                                        tooltip.style.top = event.pageY + "px";
                                    }
                                }}
                                title={point.class}
                                >
                            </path>
                        {/if}
                        <g transform={`translate(${x(point.x) * 3 - 20}, ${y(point.y) * 3 - 20})`}>
                            {#if $vis_type == "image"}
                                <image 
                                    bind:this={image_elements[i]}
                                    style="pointer-events: none;"
                                    href={`data/thumbnails/size50/${point.img}.png`}
                                    width=40 height=40 
                                    filter={i == $hover ? "url(#matrix)" : null} 
                                    title={point.class}
                                    >
                                </image>
                            {:else if $vis_type == "circle"}
                                <circle
                                    cx=10
                                    cy=10
                                    r={$hover == i ? 5 : 3}
                                    fill={$hover == i ? $colorScale(point.class) : "none"}
                                    stroke={$colorScale(point.class)}
                                ></circle>
                            {/if}
                        </g>
                        {/if}
                    {/each}
                    {#if $vis_type == "image"}
                        {#each data.filter((d, i) => $hover == i) as point, i}
                            <g transform={`translate(${x(point.x) * 3 - 40}, ${y(point.y) * 3 - 40})`}>
                                <image 
                                    style="pointer-events: none;"
                                    xlink:href={`data/thumbnails/size50/${point.img}.png`}
                                    width=80 height=80 
                                    filter="url(#matrix)"
                                    title={point.class}
                                    >
                                </image>
                            </g>
                        {/each}
                    {/if}
                </g>
            </svg>
        </div>
        <div>
            <button style="float: right; text-transform: uppercase;" on:click={() => open_dialog = false}><span class="mdi mdi-close"></span> Close</button>
        </div>
    </div> -->
</div>


<style>

    .card {
        position: relative;
        margin: 5px;
        border: 1px solid lightgrey;
        border-radius: 4px;
        padding: 5px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }

    h5 {
        text-align: left;
        margin: 0 !important;
        padding-bottom: .875rem;
    }

    .card:hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }

    svg {
        background-color: white;
        margin: -5px;
        /* <border-top: 1px solid lightgrey;
        border-bottom: 1px solid lightgrey;> */
    }

    #progressbar {
        position: absolute;
        top: 0;
        left: 0;
        margin: 0;
        background-color: white;
        overflow: hidden;
    }

    #bar {
        height: 5px;
        background-color: grey;
        text-align: center;
        line-height: 5px;
        color: white;
        overflow: hidden;
    }

    .modal {
        position: fixed; /* Stay in place */
        z-index: 1; /* Sit on top */
        left: 0;
        top: 0;
        width: 100%; /* Full width */
        height: 100%; /* Full height */
        overflow: hidden; /* Enable scroll if needed */
        background-color: rgb(0,0,0); /* Fallback color */
        background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
    }

        /* Modal Content/Box */
    .modal-content {
        margin: auto;
        padding: 20px;
    }

    .dropdown {
        position: relative;
        display: inline-block;
        overflow: visible !important;
    }

    .dropdown-content {
        z-index: 1;
        display: none;
        position: absolute;
        min-width: 160px;
        background-color: white;
        border: 1px solid lightgrey;
        border-radius: 4px;
        padding: 5px;
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }

    .dropdown.active .dropdown-content {
        display: block;
    }
</style>