export class ChatMess {
    emetteur: string;
    message: string;
    priorite: number = 0; // 1 -> Orange | 2 -> Rouge
    connect: number = -1; // -1 no state / 0 -> disconnected / 1 -> connected
} 