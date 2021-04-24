export {};
declare var browser: any;

function update_status(status: number): void {
    reroute_msg({
        source: "background",
        destination: "content",
        command: "update_status",
        status: status,
    });
}

function status_brr(status: number, timeout: number): void {
    if (!brr_running) return;
    update_status(status);
    // wait and call again
    window.setTimeout(() => {
        const new_status = status == 10 ? 1 : ++status;
        status_brr(new_status, timeout);
    }, timeout);
}

function handle_background_msg(msg: any): void {
    switch (msg.command) {
        case "status_brr": {
            brr_running = JSON.parse(msg.start);
            status_brr(1, msg.timeout);
            break;
        }
    }
}

function reroute_msg(msg: any): void {
    switch (msg.destination) {
        case "background": {
            handle_background_msg(msg);
            break;
        }
        case "content": {
            browser.tabs.query({ url: "*://*.bigbluebutton.org/*" }).then((tabs: any) => {
                for (let tab of tabs) browser.tabs.sendMessage(tab.id, msg);
            });
            break;
        }
    }
}

let brr_running = false;
browser.runtime.onMessage.addListener(reroute_msg);

// todo: notification
// browser.notifications.create({
//     type: "basic",
//     title: "You clicked a link!",
//     message: message,
// });
// console.log(message);
