export {};
declare var browser: any;

function notify(msg: string) {
    browser.notifications.create({
        type: "basic",
        title: "BBB Autostatus",
        message: msg,
    });
}

function msg_content(msg: any): void {
    browser.tabs.query({ url: "*://*.bigbluebutton.org/*" }).then((tabs: any) => {
        for (let tab of tabs) browser.tabs.sendMessage(tab.id, msg);
    });
}

function stop_daemons() {
    // if (running_daemons["status_brr"]) notify("stopped status brr.");
    if (running_daemons["anti_afk_detection"]) notify("anti afk detection offline.");
    for (let daemon_name in running_daemons) running_daemons[daemon_name] = false;
}

function status_brr(status: number, timeout: number): void {
    if (!running_daemons["status_brr"]) return;
    msg_content({
        command: "update_status",
        status: status,
    });
    // wait and call again
    window.setTimeout(() => {
        const new_status = status == 10 ? 1 : ++status;
        status_brr(new_status, timeout);
    }, timeout);
}

function blend_in(): void {
    if (!running_daemons["anti_afk_detection"]) return;
    msg_content({
        command: "blend_in",
        // todo: don't hard code
        forbidden_statuses: [],
    });
    // wait and call again
    window.setTimeout(() => {
        blend_in();
        // todo: don't hard code
    }, 3000);
}

function handle_msg(msg: any): void {
    switch (msg.command) {
        // direct reroute
        case "update_status": {
            stop_daemons();
            msg_content(msg);
            // notify("status set to " + msg.status);
            break;
        }
        case "status_brr": {
            stop_daemons();
            running_daemons["status_brr"] = true;
            status_brr(1, msg.timeout);
            // notify("status go brrrrrr.");
            break;
        }
        case "anti_afk_detection": {
            stop_daemons();
            running_daemons["anti_afk_detection"] = true;
            blend_in();
            notify("anti afk detection online.");
            break;
        }
        case "stop_daemons": {
            stop_daemons();
            break;
        }
    }
}

let running_daemons: { [name: string]: boolean } = {
    status_brr: false,
    anti_afk_detection: false,
};
browser.runtime.onMessage.addListener(handle_msg);

// todo: settings
// todo: hotkeys
