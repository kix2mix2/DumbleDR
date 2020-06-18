import { derived, writable, readable } from "svelte/store";
import * as d3 from "d3";

function createCount(N) {
    const { subscribe, set, update } = writable(N);
    return {
        subscribe,
		increment: () => update(n => n + 1),
		decrement: () => update(n => n - 1),
        reset: () => set(0),
        set: (v) => set(v),
    } 
}

function createData(n) {
    const D = {projections: [], images: [], dataset: null, hover: null, sort_time: [], color_time:[], image_time:[]};
    
    const { subscribe, set, update } = writable(D);
    return {
        subscribe,
        set_hover: (i) => update(D => {
            D.hover = i
            return D;
        }),
        load: (store, paths, dataset) => update(D => {
            pos_count.set(15);
            neg_count.set(10);
            D.ready = false;
            D.dataset = dataset;
            D.sort_time = [];
            D.color_time = [];
            D.image_time = [];
            /* paths.then(res => {
                store.set_projections(res)
            }); */
            progress.reset();
            Promise.all(paths.map(p => d3.csv(`data/${dataset}/human_sample_mini/${p}`).then(async (r) => {
                    progress.increment();
                    return r
                }
            ))).then(res => {
                res.forEach((r, i) => r.name = paths[i]);
                store.set_projections(res)
            }); 
            return D;
        }),
        set_projections: (res) => update(D => {
            
            D.projections = res.map((r, i) => {
                let result = r.map((d, j) => {
                    return {
                        "x": +d[r.columns[0]],
                        "y": +d[r.columns[1]],
                        "class": d.labels,
                        "img": d.filename,
                    }
                })
                result.name = r.name;
                result.pos_count = 0;
                result.neg_count = 0;
                result.comment = "";
                result.click_enlarge = [performance.now()];
                result.position = i;
                return result
            })
            D.images = res[0].map((row) => {
                return row.filename
            })
            D.ready = true;
            return D;
        }),
        sort_by_pos: () => update(D => {
            /* const new_positions = D.projections.map((d, i) => {
                return {"d": d, "i": i}
            }).sort((a, b) => d3.ascending(a.d.pos_count, b.d.pos_count));
            D.projections.forEach((d, i) => d.position = new_positions[i]); */
            //console.log(D.projections)
            const newD = D.projections.sort((a, b) => d3.descending(a.pos_count - a.neg_count, b.pos_count - b.neg_count));
            D.sort_time.push(performance.now());
            //if (!d3.zip(newD.map(d => d.name), D.projections.map(d => d.name)).map(([a, b]) => a == b).reduce((a, b) => a && b))
            D.projections = newD;
            return D;
        })
    }
}

let N = 10;
export const pos_count = createCount(N)
export const neg_count = createCount(N)

export const data = createData();
export const images = derived(data, $data => $data.images);
export const ready = derived(data, $data => $data.ready);
export const projections = derived(data, $data => $data.projections || []);
export const hover = derived(data, $data => $data.hover);
export const dataset = derived(data, $data => $data.dataset);

export const sort_time = derived(data, $data => $data.sort_time);
export const color_time = derived(data, $data => $data.color_time);
export const image_time = derived(data, $data => $data.image_time);



export let colorScale = readable(d3.scaleOrdinal(d3.schemeDark2));
export let bgScale = readable(d3.scaleLinear().domain([-N, 0, N]).range(["green", "white", "orangered"]));

export const vis_type = writable("image");
export const progress = createCount(0);

