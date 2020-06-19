<script>

    import { pos_count } from "./stores.js";
    export let count;
    export let projection;

    export let max = 5;
    export let neg = true;
    export let bad = false;
    
    let values = new Array(max).fill(false)
    export let symbol_filled = "mdi-heart";
    export let symbol_unfilled = "mdi-heart-outline";
    export let symbol_neg = "mdi-heart-off";
    export let symbol_neg_unfilled = "mdi-heart-off-outline";

    function update(c) {
        values = values.map((_, i) => i < count)
        projection.star_time.push({"time": performance.now(), 'rating': count})
        // console.log(projection.star_time);
    }
    $: update(count)
    
    let hover = null
</script>

{#if neg}
<span 
    class={"mdi " + (bad || hover == "neg" ? symbol_neg : symbol_neg_unfilled)}
    class:hover={hover == "neg"}
    on:click={() => {
        pos_count.set($pos_count + count)
        count = 0;
        values = values.map((_, i) => false)
        bad = !bad
    }}
    on:mouseenter={() => hover = "neg"}
    on:mouseleave={() => hover = null}
    title={`bad projection`}>
</span>{/if}
{#each values as v, i}
    <span 
        class={"mdi " + (v || hover > i ? symbol_filled : symbol_unfilled)}
        class:disabled={(i - count) >= $pos_count && !v}
        class:hover={hover > i}
        on:click={() => {
            if ((i - count) >= $pos_count && !v) return;
            const val = i + 1
            pos_count.set($pos_count + count - val)
            count = val;
            bad = false;
            values = values.map((_, i) => i < val)
        }}
        on:mouseenter={() => hover = i + 1}
        on:mouseleave={() => hover = null}
        title={`give ${i + 1} points`}>
    </span>
{/each}

<style>
    .disabled {
        color: lightgray;
    }

    .hover {
        color: red;
    }
</style>