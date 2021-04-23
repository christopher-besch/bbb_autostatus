function update_status(status) {
    reroute_msg({
        source: "popup",
        destination: "content",
        command: "update_status",
        status: status,
    });
}
function status_brr(idx, timeout) {
    if (!brr_running)
        return;
    update_status(statuses[idx]);
    window.setTimeout(() => {
        status_brr(++idx % 9, timeout);
    }, timeout);
}
function handle_background_msg(msg) {
    switch (msg.command) {
        case "status_brr": {
            brr_running = JSON.parse(msg.start);
            status_brr(0, msg.timeout);
            console.log(msg.timout);
            break;
        }
    }
}
function reroute_msg(msg) {
    switch (msg.destination) {
        case "background": {
            handle_background_msg(msg);
            break;
        }
        case "content": {
            browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
                // only to active tab
                for (let tab of tabs)
                    browser.tabs.sendMessage(tab.id, msg);
            });
            break;
        }
    }
}
const statuses = [
    "time",
    "hand",
    "undecided",
    "confused",
    "sad",
    "happy",
    "applause",
    "thumbs_up",
    "thumbs_down",
];
let brr_running = false;
// todo: select right tab
// todo: notification
browser.runtime.onMessage.addListener(reroute_msg);
export {};
// browser.notifications.create({
//     type: "basic",
//     title: "You clicked a link!",
//     message: message,
// });
// console.log(message);
//# sourceMappingURL=background.js.map