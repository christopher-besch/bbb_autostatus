function get_timeout() {
    // get value
    const timeout_raw = document.getElementById("timeout-form").value;
    const timeout = JSON.parse(timeout_raw);
    // set label
    document.getElementById("timeout-label").innerHTML =
        "Timeout: " + timeout + "ms";
    return timeout;
}
// add button listeners
window.onload = () => {
    const buttons = document.getElementsByClassName("status-button");
    for (let button of buttons)
        button.addEventListener("click", (e) => {
            browser.runtime.sendMessage({
                command: "update_status",
                status: JSON.parse(button.dataset.status),
            });
        });
};
document.getElementById("status-go-brr").addEventListener("click", (e) => {
    browser.runtime.sendMessage({
        command: "status_brr",
        timeout: get_timeout(),
    });
});
document.getElementById("anti-afk-detection").addEventListener("click", (e) => {
    browser.runtime.sendMessage({
        command: "anti_afk_detection",
    });
});
document.getElementById("open-settings").addEventListener("click", (e) => {
    browser.runtime.sendMessage({
        command: "open_settings",
    });
});
export {};
//# sourceMappingURL=popup.js.map