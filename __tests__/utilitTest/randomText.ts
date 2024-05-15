export function randomText() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let text = '';
    for (let i = 0; i < 4; i++) {
        text += characters.charAt(i);
    }
    const length = Math.floor(Math.random() * (14 - 4 + 1)) + 4;
    for (let i = 4; i < length; i++) {
        text += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return text;
}
