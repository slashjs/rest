import type {
    RESTGetAPIChannelWebhooksResult, RESTGetAPIGuildWebhooksResult,
    RESTGetAPIWebhookResult, RESTGetAPIWebhookWithTokenMessageResult,
    RESTGetAPIWebhookWithTokenResult, RESTPatchAPIWebhookJSONBody,
    RESTPatchAPIWebhookResult, RESTPatchAPIWebhookWithTokenJSONBody,
    RESTPatchAPIWebhookWithTokenMessageJSONBody, RESTPatchAPIWebhookWithTokenMessageResult,
    RESTPatchAPIWebhookWithTokenResult, RESTPostAPIChannelWebhookJSONBody,
    RESTPostAPIChannelWebhookResult, RESTPostAPIWebhookWithTokenGitHubQuery, RESTPostAPIWebhookWithTokenJSONBody,
    RESTPostAPIWebhookWithTokenResult,
    RESTPostAPIWebhookWithTokenSlackQuery
} from "discord-api-types";
import { Routes } from "../Endpoints";

/**
 * Methods for handling webhook interactions
 */
class WebhookMethods {
    public requestHandler: import("../RequestHandler");
    public disableEveryone: boolean;

    /**
     * Create a new Method Handler
     *
     * Usually SnowTransfer creates a method handler for you, this is here for completion
     *
     * You can access the methods listed via `client.webhook.method`, where `client` is an initialized SnowTransfer instance
     * @param requestHandler request handler that calls the rest api
     * @param disableEveryone Disable [at]everyone/[at]here on outgoing messages
     */
    public constructor(requestHandler: import("../RequestHandler"), disableEveryone: boolean) {
        this.requestHandler = requestHandler;
        this.disableEveryone = disableEveryone;
    }

    /**
     * Create a new Webhook
     * @param channelId Id of the channel
     * @param data Object with webhook properties
     * @returns [Webhook Object](https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_WEBHOOKS    | always    |
     *
     * @example
     * // Create a new Webhook with the name "Webby Webhook"
     * let client = new SnowTransfer('TOKEN');
     * let webhookData = {
     *   name: "Webby Webhook"
     * }
     * client.webhook.createWebhook('channel Id', webhookData);
     */
    public async createWebhook(channelId: string, data: RESTPostAPIChannelWebhookJSONBody): Promise<RESTPostAPIChannelWebhookResult> {
        return this.requestHandler.request(Routes.channelWebhooks(channelId), "post", "json", data);
    }

    /**
     * Get webhooks created within a channel
     * @param channelId Id of the channel
     * @returns Array of [Webhook Objects](https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_WEBHOOKS    | always    |
     *
     * @example
     * // Get all webhooks within a channel
     * let client = new SnowTransfer('TOKEN');
     * client.webhook.getWebhooksChannel('channel Id').then(console.log);
     */
    public async getWebhooksChannel(channelId: string): Promise<RESTGetAPIChannelWebhooksResult> {
        return this.requestHandler.request(Routes.channelWebhooks(channelId), "get", "json");
    }

    /**
     * Get all webhooks within a guild
     * @param guildId Id of the guild
     * @returns Array of [Webhook Objects](https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_WEBHOOKS    | always    |
     *
     * @example
     * // Get all webhooks within a guild
     * let client = new SnowTransfer('TOKEN');
     * client.webhook.getWebhooksGuild('guild Id').then(console.log);
     */
    public async getWebhooksGuild(guildId: string): Promise<RESTGetAPIGuildWebhooksResult> {
        return this.requestHandler.request(Routes.guildWebhooks(guildId), "get", "json");
    }

    /**
     * Get a single Webhook via Id
     * @param webhookId Id of the webhook
     * @param token Webhook token
     * @returns [Webhook Object](https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
     *
     * | Permissions needed | Condition     |
     * |--------------------|---------------|
     * | MANAGE_WEBHOOKS    | without token |
     *
     * @example
     * // Get a webhook via Id
     * let client = new SnowTransfer('TOKEN');
     * client.webhook.getWebhook('webhook Id', 'webhook token').then(console.log);
     */
    public async getWebhook(webhookId: string): Promise<RESTGetAPIWebhookResult>;
    public async getWebhook(webhookId: string, token: string): Promise<RESTGetAPIWebhookWithTokenResult>;
    public async getWebhook(webhookId: string, token?: string): Promise<RESTGetAPIWebhookResult | RESTGetAPIWebhookWithTokenResult> {
        return this.requestHandler.request(Routes.webhook(webhookId, token), "get", "json");
    }

    /**
     * Update a webhook
     * @param webhookId Id of the webhook
     * @param token Webhook token
     * @param data Updated Webhook properties
     * @returns Updated [Webhook Object](https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
     *
     * | Permissions needed | Condition     |
     * |--------------------|---------------|
     * | MANAGE_WEBHOOKS    | without token |
     *
     * @example
     * // Rename a webhook to "Captain Hook"
     * let client = new SnowTransfer('TOKEN');
     * let webhookData = {
     *   name: 'Captain Hook'
     * }
     * client.webhook.updateWebhook('webhook Id', 'webhook token', webhookData);
     */
    public async updateWebhook(webhookId: string, token: undefined, data: RESTPatchAPIWebhookJSONBody): Promise<RESTPatchAPIWebhookResult>;
    public async updateWebhook(webhookId: string, token: string, data: RESTPatchAPIWebhookWithTokenJSONBody): Promise<RESTPatchAPIWebhookWithTokenResult>;
    public async updateWebhook(webhookId: string, token: string | undefined, data: RESTPatchAPIWebhookJSONBody | RESTPatchAPIWebhookWithTokenJSONBody): Promise<RESTPatchAPIWebhookResult | RESTPatchAPIWebhookWithTokenJSONBody> {
        return this.requestHandler.request(Routes.webhook(webhookId, token), "patch", "json", data);
    }

    /**
     * Delete a Webhook
     * @param webhookId Id of the webhook
     * @param token Webhook token
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed | Condition     |
     * |--------------------|---------------|
     * | MANAGE_WEBHOOKS    | without token |
     */
    public async deleteWebhook(webhookId: string, token?: string): Promise<void> {
        return this.requestHandler.request(Routes.webhook(webhookId, token), "delete", "json");
    }

    /**
     * Send a message via Webhook
     * @param webhookId Id of the webhook
     * @param token webhook token
     * @param data Webhook data to send
     * @returns Resolves the Promise on successful execution unless wait is set to true, which returns a [message]() object
     *
     * @example
     * // Send a message saying "Hi from my webhook" with a previously created webhook
     * let client = new SnowTransfer('TOKEN');
     * client.webhook.executeWebhook('webhook Id', 'webhook token', {content: 'Hi from my webhook'})
     */
    public async executeWebhook(webhookId: string, token: string, data: WebhookCreateMessageData, options?: { wait?: false; disableEveryone?: boolean; thread_id?: string; }): Promise<void>;
    public async executeWebhook(webhookId: string, token: string, data: WebhookCreateMessageData, options: { wait: true; disableEveryone?: boolean; thread_id?: string; }): Promise<RESTPostAPIWebhookWithTokenResult>;
    public async executeWebhook(webhookId: string, token: string, data: WebhookCreateMessageData, options: { wait?: boolean; disableEveryone?: boolean; thread_id?: string; } = { wait: false, disableEveryone: this.disableEveryone }): Promise<void | RESTPostAPIWebhookWithTokenResult> {
        if (typeof data !== "string" && !data?.content && !data?.embeds && !data?.files) {
            throw new Error("Missing content or embeds or files");
        }
        if (typeof data === "string") {
            data = { content: data };
        }

        // Sanitize the message
        if (data.content && (options?.disableEveryone !== undefined ? options.disableEveryone : this.disableEveryone)) {
            data.content = data.content.replace(/@([^<>@ ]*)/gsmu, replaceEveryone);
        }

        if (data.files) return this.requestHandler.request(Routes.webhook(webhookId, token) + (options?.wait ? "?wait=true" : "") + (options?.thread_id ? `${options?.wait ? "&" : "?"}thread_id=${options.thread_id}` : ""), "post", "multipart", data);
        else return this.requestHandler.request(Routes.webhook(webhookId, token) + (options?.wait ? "?wait=true" : "") + (options?.thread_id ? `${options?.wait ? "&" : "?"}thread_id=${options.thread_id}` : ""), "post", "json", data);
    }

    /**
     * Execute a slack style Webhook
     * @param webhookId Id of the Webhook
     * @param token Webhook token
     * @param data Check [Slack's documentation](https://api.slack.com/incoming-webhooks)
     * @param options Options for disabling everyone/here pings or setting the wait query string
     * @returns Resolves the Promise on successful execution
     */
    public async executeWebhookSlack(webhookId: string, token: string, data: Record<string, unknown> & RESTPostAPIWebhookWithTokenSlackQuery, options: { wait?: boolean; disableEveryone?: boolean; thread_id?: string; } = { wait: false, disableEveryone: this.disableEveryone }): Promise<void> {
        // Sanitize the message
        if (typeof data.text === "string" && (options?.disableEveryone !== undefined ? options.disableEveryone : this.disableEveryone)) {
            data.text = data.text.replace(/@([^<>@ ]*)/gsmu, replaceEveryone);
        }

        return this.requestHandler.request(Routes.webhookPlatform(webhookId, token, "slack") + (options?.wait ? "?wait=true" : "") + (options?.thread_id ? `${options?.wait ? "&" : "?"}thread_id=${options.thread_id}` : ""), "post", "json", data);
    }

    /**
     * Executes a github style Webhook
     * @param webhookId Id of the Webhook
     * @param token Webhook token
     * @param data Check [GitHub's documentation](https://docs.github.com/en/developers/webhooks-and-events/webhook-events-and-payloads#webhook-payload-object)
     * @param options Options for disabling everyone/here pings or setting the wait query string
     * @returns Resolves the Promise on successful execution
     */
    public async executeWebhookGitHub(webhookId: string, token: string, data: RESTPostAPIWebhookWithTokenGitHubQuery, options: { wait?: boolean; thread_id?: string; } = { wait: false }): Promise<void> {
        return this.requestHandler.request(Routes.webhookPlatform(webhookId, token, "github") + (options?.wait ? "?wait=true" : "") + (options?.thread_id ? `${options?.wait ? "&" : "?"}thread_id=${options.thread_id}` : ""), "post", "json", data);
    }

    /**
     * Get a single message from a specific Webhook via Id
     * @param webhookId Id of the Webhook
     * @param token Webhook token
     * @param messageId Id of the message
     * @returns [discord message](https://discord.com/developers/docs/resources/channel#message-object) object
     */
    public async getWebhookMessage(webhookId: string, token: string, messageId: string): Promise<RESTGetAPIWebhookWithTokenMessageResult> {
        return this.requestHandler.request(Routes.webhookMessage(webhookId, token, messageId), "get", "json");
    }

    /**
     * Edit a message sent by a Webhook
     * @param webhookId Id of the Webhook
     * @param token Webhook token
     * @param messageId Id of the message
     * @param data Data to send
     * @returns [discord message](https://discord.com/developers/docs/resources/channel#message-object) object
     */
    public async editWebhookMessage(webhookId: string, token: string, messageId: string, data: WebhookEditMessageData): Promise<RESTPatchAPIWebhookWithTokenMessageResult> {
        let threadID: string | undefined = undefined;
        if (data.thread_id) threadID = data.thread_id;
        delete data.thread_id;
        if (data.files) return this.requestHandler.request(Routes.webhookMessage(webhookId, token, messageId) + (threadID ? `?thread_id=${threadID}` : ""), "patch", "multipart", data);
        else return this.requestHandler.request(Routes.webhookMessage(webhookId, token, messageId) + (threadID ? `?thread_id=${threadID}` : ""), "patch", "json", data);
    }

    /**
     * Delete a message sent by a Webhook
     * @param webhookId Id of the Webhook
     * @param token Webhook token
     * @param messageId Id of the message
     * @returns Resolves the Promise on successful execution
     */
    public async deleteWebhookMessage(webhookId: string, token: string, messageId: string): Promise<void> {
        return this.requestHandler.request(Routes.webhookMessage(webhookId, token, messageId), "delete", "json");
    }
}

function replaceEveryone(match: string, target: string) {
    if (target.match(/^[&!]?\d+$/)) {
        return `@${target}`;
    } else {
        return `@\u200b${target}`;
    }
}

type WebhookCreateMessageData = RESTPostAPIWebhookWithTokenJSONBody & {
    files?: {
        name: string;
        file: Buffer;
    }[];
};

type WebhookEditMessageData = RESTPatchAPIWebhookWithTokenMessageJSONBody & {
    thread_id?: string;
    files?: {
        name: string;
        file: Buffer;
    }[];
};

export = WebhookMethods;