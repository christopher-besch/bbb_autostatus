function update_settings(overwrite) {
    ////////////////////
    // afk-checkboxes //
    ////////////////////
    const elements = document.getElementsByClassName("afk-form");
    for (let element of elements) {
        const status = JSON.parse(element.dataset.status);
        // overwrite form or load into storage
        if (overwrite)
            element.checked = forbidden_statuses[status];
        else
            forbidden_statuses[status] = element.checked;
    }
    // update storage
    browser.storage.sync.set({ forbidden_statuses: forbidden_statuses });
    ///////////////
    // shortcuts //
    ///////////////
    const toggle_raise_form = document.getElementById("toggle-raise-form");
    if (overwrite) {
        browser.commands.getAll().then((commands) => {
            for (let command of commands)
                switch (command.name) {
                    case "toggle-raise": {
                        toggle_raise_form.value = command.shortcut;
                        break;
                    }
                }
        });
    }
    else {
        let error_p = document.getElementById("invalid-shortcut");
        // todo: very bad but the promise exception somehow doesn't work
        error_p.style.display = "block";
        browser.commands
            .update({
            name: "toggle-raise",
            shortcut: toggle_raise_form.value,
        })
            .then(() => {
            // success -> remove invalid label
            error_p.style.display = "none";
        });
    }
}
const update_settings_button = document.getElementById("update-settings");
update_settings_button.addEventListener("click", (e) => {
    update_settings(false);
});
let forbidden_statuses = {
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
    browser.storage.sync.get().then((result) => {
        // only overwrite if entry existent in storage
        if (result.forbidden_statuses !== undefined)
            forbidden_statuses = result.forbidden_statuses;
        update_settings(true);
    });
};
export {};
//# sourceMappingURL=options.js.map