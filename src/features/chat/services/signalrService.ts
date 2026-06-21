import * as signalR from "@microsoft/signalr";
import type { ChatMessage } from "../types/chat";

class SignalRService {
  private connection: signalR.HubConnection | null = null;

  async start(token: string) {
    if (this.connection) return;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`http://${window.location.hostname}:5254/chatHub`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    await this.connection.start();
  }

  async stop() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }

  async sendPrivateMessage(receiverId: string, messageText: string) {
    if (!this.connection) {
      throw new Error("SignalR connection is not started");
    }

    await this.connection.invoke("SendPrivateMessage", receiverId, messageText);
  }

  onReceiveMessage(callback: (message: ChatMessage) => void) {
    this.connection?.on("ReceiveMessage", callback);
  }

  offReceiveMessage(callback: (message: ChatMessage) => void) {
    this.connection?.off("ReceiveMessage", callback);
  }

  onReconnecting(callback: () => void) {
    this.connection?.onreconnecting(callback);
  }

  onReconnected(callback: () => void) {
    this.connection?.onreconnected(callback);
  }

  onClose(callback: () => void) {
    this.connection?.onclose(callback);
  }

  getConnection() {
    return this.connection;
  }
}

export const signalrService = new SignalRService();
