<!-- EventGrid.svelte -->
<script>
    import { onMount, onDestroy } from "svelte";
    import { timelineEvents } from "../stores/timeline-events";
    import { currentTime } from "../stores/current-time"; // Import the store
    import "ag-grid-community/styles/ag-grid.css";
    import "ag-grid-community/styles/ag-theme-alpine.css";
    import "ag-grid-community/styles/ag-theme-alpine-dark.css"; // Import the dark theme CSS
    import { Grid } from "ag-grid-community";

    let gridDiv;
    let gridOptions;

    const setPlayheadPosition = (time) => {
        currentTime.set(time);
    };

    onMount(() => {
        gridOptions = {
            columnDefs: [
                {
                    headerName: "Start",
                    field: "start",
                    sortable: true,
                    filter: true,
                },
                {
                    headerName: "End",
                    field: "end",
                    sortable: true,
                    filter: true,
                },
                {
                    headerName: "Content",
                    field: "content",
                    sortable: true,
                    filter: true,
                },
                {
                    headerName: "Actions",
                    field: "actions",
                    cellRendererFramework: (params) => {
                        const container = document.createElement("div");

                        const startButton = document.createElement("button");
                        startButton.innerText = "Start";
                        startButton.onclick = () =>
                            setPlayheadPosition(params.data.start);
                        container.appendChild(startButton);

                        const endButton = document.createElement("button");
                        endButton.innerText = "End";
                        endButton.onclick = () =>
                            setPlayheadPosition(params.data.end);
                        container.appendChild(endButton);

                        return container;
                    },
                },
            ],
            rowData: [], // Initialize rowData with an empty array
            defaultColDef: {
                flex: 1,
                minWidth: 150,
                resizable: true,
            },
            pagination: true,
            paginationPageSize: 10,
        };

        const grid = new Grid(gridDiv, gridOptions);

        // Subscribe to changes in timelineEvents store
        const unsubscribe = timelineEvents.subscribe((state) => {
            if (gridOptions.api) {
                gridOptions.api.setRowData(state.events); // Update rowData when store changes
            }
        });

        return () => {
            unsubscribe();
            if (gridOptions.api) {
                gridOptions.api.destroy();
            }
        };
    });

    onDestroy(() => {
        if (gridOptions && gridOptions.api) {
            gridOptions.api.destroy();
        }
    });
</script>

<div
    class="ag-theme-alpine-dark"
    bind:this={gridDiv}
    style="height: 500px; width: 100%;"
></div>

<style>
    button {
        margin: 2px;
        padding: 5px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
    }
    button:hover {
        background-color: #555;
        color: white;
    }
</style>
