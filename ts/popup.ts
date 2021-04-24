export {};
declare var browser: any;

function update_status(status: number): void {
    // set new status
    browser.runtime.sendMessage({
        command: "update_status",
        status: status,
    });
}

function add_status_button_listener(): void {
    const buttons = document.getElementsByClassName(
        "status-button"
    ) as HTMLCollectionOf<HTMLButtonElement>;
    for (let button of buttons) {
        button.addEventListener("click", (e) => {
            update_status(JSON.parse(button.dataset.status as string));
        });
    }
}

function get_timeout(): number {
    // get value
    const timeout_raw = (document.getElementById("timeout-form") as HTMLInputElement).value;
    const timeout = JSON.parse(timeout_raw);
    // set label
    (document.getElementById("timeout-label") as HTMLLabelElement).innerHTML =
        "Timeout: " + timeout + "ms";
    return timeout;
}

window.onload = add_status_button_listener;
(document.getElementById("status-go-brr") as HTMLButtonElement).addEventListener("click", (e) => {
    browser.runtime.sendMessage({
        command: "status_brr",
        timeout: get_timeout(),
    });
});

(document.getElementById("anti-afk-detection") as HTMLButtonElement).addEventListener(
    "click",
    (e) => {
        browser.runtime.sendMessage({
            command: "anti_afk_detection",
        });
    }
);
