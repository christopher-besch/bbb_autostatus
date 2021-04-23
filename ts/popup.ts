export {};
declare var browser: any;

// function update_settings(): void {
//     const status = (document.getElementById("status-form") as HTMLInputElement).value;
//     // send message to background
//     browser.runtime.sendMessage({
//         source: "popup",
//         destination: "content",
//         command: "update_status",
//         status: status,
//     });
// }

function update_status(status: string): void {
    // stop brr
    status_brr(false, 1000);
    // set new status
    browser.runtime.sendMessage({
        source: "popup",
        destination: "content",
        command: "update_status",
        status: status,
    });
}

function status_brr(start: boolean, timeout: number): void {
    browser.runtime.sendMessage({
        source: "popup",
        destination: "background",
        command: "status_brr",
        start: start,
        timeout: timeout,
    });
}

function add_status_button_listener(): void {
    const buttons = document.getElementsByClassName(
        "status-button"
    ) as HTMLCollectionOf<HTMLButtonElement>;
    for (let button of buttons) {
        button.addEventListener("click", (e) => {
            update_status(button.dataset.status as string);
        });
    }
}

function get_timout(): number {
    // get value
    const timeout_raw = (document.getElementById("timeout-form") as HTMLInputElement).value;
    const timeout = JSON.parse(timeout_raw);
    // set label
    (document.getElementById(
        "timeout-label"
    ) as HTMLLabelElement).innerHTML = `Timeout: ${timeout}ms`;
    return timeout;
}

window.onload = add_status_button_listener;
(document.getElementById("status-go-brr") as HTMLButtonElement).addEventListener("click", (e) => {
    status_brr(true, get_timout());
});

// icon-bbb-time
// icon-bbb-hand
// icon-bbb-undecided
// icon-bbb-confused
// icon-bbb-sad
// icon-bbb-happy
// icon-bbb-applause
// icon-bbb-thumbs_up
// icon-bbb-thumbs_down
