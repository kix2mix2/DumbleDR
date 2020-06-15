<script>
    export let string;

    $: [name, ...parameters] = string.split("_");

    let name_dict = {
        "ISM": "Isomap",
        "UMAP": "UMAP",
        "TSNE": "t-SNE",
        "GRP": "GRP",
        "SE": "Spectral Embedding",
        "PCA": "PCA",
    }
</script>

{name_dict[name] || name}{#if parameters.length > 0}: 
    {#each parameters as p}
        <span>
            {p}
        </span>
    {/each}
{/if}