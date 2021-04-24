export {};
declare let browser: any;

function update_settings(overwrite: boolean): void {
    ////////////////////
    // afk-checkboxes //
    ////////////////////
    const elements = document.getElementsByClassName(
        "afk-form"
    ) as HTMLCollectionOf<HTMLInputElement>;
    for (let element of elements) {
        // currently selected status
        const status = JSON.parse(element.dataset.status as string) as number;
        // overwrite form or load into storage
        if (overwrite) element.checked = forbidden_statuses[status];
        else forbidden_statuses[status] = element.checked;
    }
    // update storage
    browser.storage.sync.set({ forbidden_statuses: forbidden_statuses });

    ///////////////
    // shortcuts //
    ///////////////
    const toggle_raise_form = document.getElementById("toggle-raise-form") as HTMLInputElement;
    if (overwrite) {
        browser.commands.getAll().then((commands: any) => {
            for (let command of commands)
                if (command.name === "toggle-raise") toggle_raise_form.value = command.shortcut;
        });
    }
}

const update_settings_button = document.getElementById("update-settings") as HTMLButtonElement;
update_settings_button.addEventListener("click", (e) => {
    update_settings(false);
});

let forbidden_statuses: { [status: number]: boolean } = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false,
};
window.onload = () => {
    browser.storage.sync.get().then((result: any) => {
        // only overwrite if entry existent in storage
        if (result.forbidden_statuses !== undefined) forbidden_statuses = result.forbidden_statuses;
        update_settings(true);
    });
};
