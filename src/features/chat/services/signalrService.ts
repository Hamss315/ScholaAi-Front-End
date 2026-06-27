import * as signalR from "@microsoft/signalr";
import type { ChatMessage } from "../types/chat";

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private currentToken: string | null = null;
  private receiveMessageCallbacks: Array<(message: ChatMessage) => void> = [];
  private reconnectingCallbacks: Array<() => void> = [];
  private reconnectedCallbacks: Array<() => void> = [];
  private closeCallbacks: Array<() => void> = [];

  async start(token: string) {
    // If connection exists and the token is the same, no action needed
    if (this.connection && this.currentToken === token) {
      return;
    }

    // If the token changed, stop and cleanup the old connection
    if (this.connection) {
      console.log("[SignalRService] Token changed or connection exists with different credentials. Stopping old connection...");
      await this.stop();
    }

    this.currentToken = token;
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`http://${window.location.hostname}:5254/chatHub`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    // Register stored callbacks on the new connection
    for (const callback of this.receiveMessageCallbacks) {
      this.connection.on("ReceiveMessage", callback);
    }
    for (const callback of this.reconnectingCallbacks) {
      this.connection.onreconnecting(callback);
    }
    for (const callback of this.reconnectedCallbacks) {
      this.connection.onreconnected(callback);
    }
    for (const callback of this.closeCallbacks) {
      this.connection.onclose(callback);
    }

    await this.connection.start();
    console.log("[SignalRService] Connection started successfully.");
  }

  async stop() {
    if (this.connection) {
      try {
        await this.connection.stop();
      } catch (err) {
        console.error("[SignalRService] Error stopping connection:", err);
      }
      this.connection = null;
      this.currentToken = null;
    }
  }

  async sendPrivateMessage(receiverId: string, messageText: string) {
    if (!this.connection) {
      throw new Error("SignalR connection is not started");
    }

    await this.connection.invoke("SendPrivateMessage", receiverId, messageText);
  }

  onReceiveMessage(callback: (message: ChatMessage) => void) {
    if (!this.receiveMessageCallbacks.includes(callback)) {
      this.receiveMessageCallbacks.push(callback);
    }
    this.connection?.on("ReceiveMessage", callback);
  }

  offReceiveMessage(callback: (message: ChatMessage) => void) {
    this.receiveMessageCallbacks = this.receiveMessageCallbacks.filter(c => c !== callback);
    this.connection?.off("ReceiveMessage", callback);
  }

  onReconnecting(callback: () => void) {
    if (!this.reconnectingCallbacks.includes(callback)) {
      this.reconnectingCallbacks.push(callback);
    }
    this.connection?.onreconnecting(callback);
  }

  onReconnected(callback: () => void) {
    if (!this.reconnectedCallbacks.includes(callback)) {
      this.reconnectedCallbacks.push(callback);
    }
    this.connection?.onreconnected(callback);
  }

  onClose(callback: () => void) {
    if (!this.closeCallbacks.includes(callback)) {
      this.closeCallbacks.push(callback);
    }
    this.connection?.onclose(callback);
  }

  getConnection() {
    return this.connection;
  }
}

export const signalrService = new SignalRService();

