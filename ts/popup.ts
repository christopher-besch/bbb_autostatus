export {};
declare let browser: any;

function get_timeout(): number {
    // get value
    const timeout_raw = (document.getElementById("timeout-form") as HTMLInputElement).value;
    const timeout = JSON.parse(timeout_raw) as number;
    // set label
    (document.getElementById("timeout-label") as HTMLLabelElement).innerHTML =
        "Timeout: " + timeout + "ms";
    return timeout;
}

// add button listeners
window.onload = () => {
    const buttons = document.getElementsByClassName(
        "status-button"
    ) as HTMLCollectionOf<HTMLButtonElement>;
    for (let button of buttons)
        button.addEventListener("click", (e) => {
            browser.runtime.sendMessage({
                command: "update_status",
                status: JSON.parse(button.dataset.status as string),
            });
        });
};

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

(document.getElementById("open-settings") as HTMLButtonElement).addEventListener("click", (e) => {
    browser.runtime.sendMessage({
        command: "open_settings",
    });
});
