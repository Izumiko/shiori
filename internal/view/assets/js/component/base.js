function defaultDialog(parent) {
    return {
        visible: false,
        loading: false,
        title: '',
        content: '',
        fields: [],
        showLabel: false,
        mainText: 'Yes',
        secondText: '',
        mainClick: () => {
            parent.dialog.visible = false;
        },
        secondClick: () => {
            parent.dialog.visible = false;
        },
        escPressed: () => {
            if (!parent.loading) parent.dialog.visible = false;
        }
    }
}

function isSessionError(err) {
    switch (err.toString().replace(/\(\d+\)/g, "").trim().toLowerCase()) {
        case "session is not exist":
        case "session has been expired":
            return true
        default:
            return false;
    }
}

export function showDialog(parent, cfg) {
    var base = defaultDialog(parent);
    base.visible = true;
    if (cfg.loading) base.loading = cfg.loading;
    if (cfg.title) base.title = cfg.title;
    if (cfg.content) base.content = cfg.content;
    if (cfg.fields) base.fields = cfg.fields;
    if (cfg.showLabel) base.showLabel = cfg.showLabel;
    if (cfg.mainText) base.mainText = cfg.mainText;
    if (cfg.secondText) base.secondText = cfg.secondText;
    if (cfg.mainClick) base.mainClick = cfg.mainClick;
    if (cfg.secondClick) base.secondClick = cfg.secondClick;
    if (cfg.escPressed) base.escPressed = cfg.escPressed;
    parent.dialog = base;
}

export async function getErrorMessage(err) {
    switch (err.constructor) {
        case Error:
            return err.message;
        case Response:
            const text = await err.text();
            return `${text} (${err.status})`;
        default:
            return err;
    }
}

export function showErrorDialog(parent, msg) {
    const sessionError = isSessionError(msg),
        dialogContent = sessionError ? "Session has expired, please login again." : msg;

    showDialog(parent, {
        visible: true,
        title: "Error",
        content: dialogContent,
        mainText: "OK",
        mainClick: () => {
            parent.dialog.visible = false;
            if (sessionError) {
                const loginUrl = new URL("login", document.baseURI);
                loginUrl.query.dst = window.location.href;

                document.cookie = `session-id=; Path=${new URL(document.baseURI).pathname}; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
                location.href = loginUrl.toString();
            }
        }
    });
}