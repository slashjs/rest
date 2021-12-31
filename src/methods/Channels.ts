import type {
    APIUser, RESTGetAPIChannelMessagesQuery, RESTGetAPIChannelThreadMembersResult,
    RESTPatchAPIChannelJSONBody, RESTPatchAPIChannelMessageJSONBody, RESTPostAPIChannelInviteJSONBody,
    RESTPostAPIChannelMessageJSONBody, RESTPostAPIChannelThreadsResult, RESTPutAPIChannelPermissionJSONBody,
    RESTGetAPIChannelResult, RESTPatchAPIChannelResult, RESTDeleteAPIChannelResult, RESTGetAPIChannelMessagesResult,
    RESTPostAPIChannelMessageResult, RESTPostAPIChannelMessageCrosspostResult, RESTPatchAPIChannelMessageResult,
    Snowflake, RESTGetAPIChannelInvitesResult, RESTPostAPIChannelInviteResult, RESTGetAPIChannelPinsResult,
    RESTGetAPIChannelUsersThreadsArchivedResult, RESTGetAPIChannelThreadsArchivedQuery
} from "discord-api-types";
import { Routes } from "../Endpoints";
import Constants from "../Constants";

/**
 * Methods for interacting with Channels and Messages
 */
class ChannelMethods {
    public requestHandler: import("../RequestHandler");
    public disableEveryone: boolean;

    /**
     * Create a new Channel Method handler
     *
     * Usually SnowTransfer creates a method handler for you, this is here for completion
     *
     * You can access the methods listed via `client.channel.method`, where `client` is an initialized SnowTransfer instance
     * @param requestHandler request handler that calls the rest api
     * @param disableEveryone Disable [at]everyone/[at]here on outgoing messages
     */
    public constructor(requestHandler: import("../RequestHandler"), disableEveryone: boolean) {
        this.requestHandler = requestHandler;
        this.disableEveryone = disableEveryone;
    }

    /**
     * Get a channel via Id
     * @param channelId Id of the channel
     * @returns [discord channel](https://discord.com/developers/docs/resources/channel#channel-object) object
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | VIEW_CHANNEL       | always    |
     *
     * @example
     * let client = new SnowTransfer('TOKEN')
     * let channel = await client.channel.getChannel('channel id')
     */
    public async getChannel(channelId: string): Promise<RESTGetAPIChannelResult> {
        return this.requestHandler.request(Routes.channel(channelId), "get", "json");
    }

    /**
     * Update a channel or thread
     * @param channelId Id of the channel
     * @param data Data to send
     * @returns [discord channel](https://discord.com/developers/docs/resources/channel#channel-object) object
     *
     * | Permissions needed | Condition                                                                                                       |
     * |--------------------|-----------------------------------------------------------------------------------------------------------------|
     * | VIEW_CHANNEL       | always                                                                                                          |
     * | MANAGE_CHANNELS    | always                                                                                                          |
     * | MANAGE_THREADS     | When editing a Thread to change the name, archived, auto_archive_duration, rate_limit_per_user or locked fields |
     *
     * @example
     * // This example updates a channel with the passed id to use "New Name" as it's name and "Look at this cool topic" as the topic
     * let client = new SnowTransfer('TOKEN')
     * let updateData = {
     *   name: 'New Name',
     *   topic: 'Look at this cool topic'
     * }
     * client.channel.updateChannel('channel id', updateData)
     */
    public async updateChannel(channelId: string, data: RESTPatchAPIChannelJSONBody): Promise<RESTPatchAPIChannelResult> {
        return this.requestHandler.request(Routes.channel(channelId), "patch", "json", data);
    }

    /**
     * Delete a channel or thread via Id
     *
     * This either **deletes** a Guild Channel or **closes** a Direct Message Channel
     *
     * **Be careful with deleting Guild Channels as this can not be undone!**
     *
     * When deleting a category, this does **not** delete the child channels of a category. They will just have their `parent_id` removed.
     * @param channelId Id of the channel
     * @param reason Reason for deleting the channel
     * @returns [discord channel](https://discord.com/developers/docs/resources/channel#channel-object) object
     *
     * | Permissions needed | Condition                       |
     * |--------------------|---------------------------------|
     * | VIEW_CHANNEL       | always                          |
     * | MANAGE_CHANNELS    | When deleting a Guild Channel   |
     * | MANAGE_THREADS     | When channelId is a Thread's Id |
     */
    public async deleteChannel(channelId: string, reason?: string): Promise<RESTDeleteAPIChannelResult> {
        return this.requestHandler.request(Routes.channel(channelId), "delete", "json", reason ? { reason } : undefined);
    }

    /**
     * Get a list of messages from a channel
     * @param channelId Id of the channel
     * @returns Array of [discord message](https://discord.com/developers/docs/resources/channel#message-object) objects
     *
     * | Permissions needed   | Condition |
     * |----------------------|-----------|
     * | VIEW_CHANNEL         | always    |
     * | READ_MESSAGE_HISTORY | always    |
     *
     * @example
     * // Fetch the last 20 messages from a channel
     * let client = new SnowTransfer('TOKEN')
     * let options = {
     *   limit: 20
     * }
     * let messages = await client.channel.getChannelMessages('channel id', options);
     */
    public async getChannelMessages(channelId: string, options: RESTGetAPIChannelMessagesQuery = { limit: 50 }): Promise<RESTGetAPIChannelMessagesResult> {
        if (options.around) {
            delete options.before;
            delete options.after;
        } else if (options.before) {
            delete options.around;
            delete options.after;
        } else if (options.after) {
            delete options.before;
            delete options.around;
        }
        if (options.limit && options.limit > Constants.GET_CHANNEL_MESSAGES_MAX_RESULTS) {
            throw new Error(`The maximum amount of messages that may be requested is ${Constants.GET_CHANNEL_MESSAGES_MAX_RESULTS}`);
        }
        return this.requestHandler.request(Routes.channelMessages(channelId), "get", "json", options);
    }

    /**
     * Get a single message via Id
     * @param channelId Id of the channel
     * @param messageId Id of the message
     * @returns [discord message](https://discord.com/developers/docs/resources/channel#message-object) object
     *
     * | Permissions needed   | Condition |
     * |----------------------|-----------|
     * | VIEW_CHANNEL         | always    |
     * | READ_MESSAGE_HISTORY | always    |
     *
     * @example
     * // Get a single message from a channel via id
     * let client = new SnowTransfer('TOKEN')
     * let message = await client.channel.getChannelMessage('channel id', 'message id')
     */
    public async getChannelMessage(channelId: string, messageId: string): Promise<RESTGetAPIChannelMessagesResult> {
        return this.requestHandler.request(Routes.channelMessage(channelId, messageId), "get", "json");
    }

    /**
     * Creates a new Message within a channel
     *
     * **Make sure to use a filename with a proper extension (e.g. png, jpeg, etc.) when you want to upload files**
     * @param channelId Id of the Channel to sent a message to
     * @param data Data to send, if data is a string it will be used as the content of the message,
     * if data is not a string you should take a look at the properties below to know what you may send
     * @returns [discord message](https://discord.com/developers/docs/resources/channel#message-object) object
     *
     * | Permissions needed       | Condition                                                               |
     * |--------------------------|-------------------------------------------------------------------------|
     * | VIEW_CHANNEL             | always                                                                  |
     * | SEND_MESSAGES            | if the message was sent by the current user and not in a thread channel |
     * | SEND_MESSAGES_IN_THREADS | if the message was sent by the current user and is in a thread channel  |
     *
     * @example
     * // Make a bot say "hi" within a channel
     * // createMessage sends the passed data as content, when you give it a string
     * let client = new SnowTransfer('TOKEN')
     * client.channel.createMessage('channel id', 'hi')
     *
     * @example
     * // Send a rich embed object
     * let client = new SnowTransfer('TOKEN')
     * let embedData = {
     *   title: 'This is a nice embed',
     *   description: 'But winter is so cold',
     *   fields: [
     *       {name: 'Brr', value: 'Insert snowflake emoji here'}
     *     ]
     * }
     * client.channel.createMessage('channel id', {embeds: [embedData]})
     *
     * @example
     * // Send a file with a comment
     * let client = new SnowTransfer('TOKEN')
     * // fileData will be a buffer with the data of the png image.
     * let fileData = fs.readFileSync('nice_picture.png') // You should probably use fs.readFile, since it's asynchronous, synchronous methods may lag your bot.
     * client.channel.createMessage('channel id', {content: 'This is a nice picture', files: [{name: 'Optional Filename.png', file: fileData}]})
     */
    public async createMessage(channelId: string, data: string | CreateMessageData, options: { disableEveryone?: boolean; } = { disableEveryone: this.disableEveryone }): Promise<RESTPostAPIChannelMessageResult> {
        if (typeof data !== "string" && !data.content && !data.embeds && !data.files) {
            throw new Error("Missing content or embeds or files");
        }
        if (typeof data === "string") {
            data = { content: data };
        }

        // Sanitize the message
        if (data.content && (options.disableEveryone !== undefined ? options.disableEveryone : this.disableEveryone)) {
            data.content = data.content.replace(/@([^<>@ ]*)/gsmu, replaceEveryone);
        }

        if (data.files) return this.requestHandler.request(Routes.channelMessages(channelId), "post", "multipart", data);
        else return this.requestHandler.request(Routes.channelMessages(channelId), "post", "json", data);
    }

    /**
     * Crosspost a message in a news channel to all following channels
     * @param channelId Id of the news channel
     * @param messageId Id of the message
     * @returns [discord message](https://discord.com/developers/docs/resources/channel#message-object) object
     *
     * | Permissions needed       | Condition                                                               |
     * |--------------------------|-------------------------------------------------------------------------|
     * | VIEW_CHANNEL             | always                                                                  |
     * | SEND_MESSAGES            | if the message was sent by the current user and not in a thread channel |
     * | SEND_MESSAGES_IN_THREADS | if the message was sent by the current user and is in a thread channel  |
     * | MANAGE_MESSAGES          | if the message wasn't sent by the current user                          |
     */
    public async crosspostMessage(channelId: string, messageId: string): Promise<RESTPostAPIChannelMessageCrosspostResult> {
        return this.requestHandler.request(Routes.channelMessageCrosspost(channelId, messageId), "post", "json");
    }

    /**
     * Edit a message sent by the current user or edit the message flags of another user's message
     * @param channelId Id of the channel
     * @param messageId Id of the message
     * @param data Data to send
     * @returns [discord message](https://discord.com/developers/docs/resources/channel#message-object) object
     *
     * | Permissions needed | Condition                                        |
     * |--------------------|--------------------------------------------------|
     * | VIEW_CHANNEL       | always                                           |
     * | MANAGE_MESSAGES    | When editing someone else's message to set flags |
     *
     * @example
     * // Simple ping response
     * let client = new SnowTransfer('TOKEN')
     * let time = Date.now()
     * let message = await client.channel.createMessage('channel id', 'pong')
     * client.channel.editMessage('channel id', message.id, `pong ${Date.now() - time}ms`)
     */
    public async editMessage(channelId: string, messageId: string, data: string | EditMessageData, options: { disableEveryone?: boolean; } = { disableEveryone: this.disableEveryone }): Promise<RESTPatchAPIChannelMessageResult> {
        if (typeof data !== "string" && data.content === undefined && data.embeds === undefined && data.files === undefined) {
            throw new Error("Missing content or embeds or files");
        }
        if (typeof data === "string") {
            data = { content: data };
        }

        // Sanitize the message
        if (data.content && (options.disableEveryone !== undefined ? options.disableEveryone : this.disableEveryone)) {
            data.content = data.content.replace(/@([^<>@ ]*)/gsmu, replaceEveryone);
        }

        if (data.files) return this.requestHandler.request(Routes.channelMessage(channelId, messageId), "patch", "multipart", data);
        else return this.requestHandler.request(Routes.channelMessage(channelId, messageId), "patch", "json", data);
    }

    /**
     * Delete a message
     * @param channelId Id of the channel
     * @param messageId Id of the message
     * @param reason Reason for deleting the message
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed | Condition                                    |
     * |--------------------|----------------------------------------------|
     * | VIEW_CHANNEL       | always                                       |
     * | MANAGE_MESSAGES    | When the bot isn't the author of the message |
     *
     * @example
     * // Delete a message
     * let client = new SnowTransfer('TOKEN')
     * client.channel.deleteMessage('channel id', 'message id')
     */
    public async deleteMessage(channelId: string, messageId: string, reason?: string): Promise<void> {
        return this.requestHandler.request(Routes.channelMessage(channelId, messageId), "delete", "json", reason ? { reason } : undefined);
    }

    /**
     * Bulk delete messages, messages may not be older than 2 weeks
     * @param channelId Id of the channel
     * @param messages array of message ids to delete
     * @param reason Reason for deleting the messages
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | VIEW_CHANNEL       | always    |
     * | MANAGE_MESSAGES    | always    |
     */
    public async bulkDeleteMessages(channelId: string, messages: Snowflake[], reason?: string): Promise<void> {
        if (messages.length < Constants.BULK_DELETE_MESSAGES_MIN || messages.length > Constants.BULK_DELETE_MESSAGES_MAX) {
            throw new Error(`Amount of messages to be deleted has to be between ${Constants.BULK_DELETE_MESSAGES_MIN} and ${Constants.BULK_DELETE_MESSAGES_MAX}`);
        }
        // (Current date - (discord epoch + 2 weeks)) * (2**22) weird constant that everybody seems to use
        const oldestSnowflake = BigInt(Date.now() - 1421280000000) * (BigInt(2) ** BigInt(22));
        const forbiddenMessage = messages.find(m => BigInt(m) < oldestSnowflake);
        if (forbiddenMessage) {
            throw new Error(`The message ${forbiddenMessage} is older than 2 weeks and may not be deleted using the bulk delete endpoint`);
        }
        const data = { messages };
        if (reason) Object.assign(data, { reason });
        return this.requestHandler.request(Routes.channelBulkDelete(channelId), "post", "json", data);
    }

    /**
     * Adds a reaction to a message
     * @param channelId Id of the channel
     * @param messageId Id of the message
     * @param emoji uri encoded reaction emoji to add,
     * you may either use a discord emoji in the format `:emoji_name:emoji_id` or a unicode emoji,
     * which can be found [here](http://www.unicode.org/emoji/charts/full-emoji-list.html)
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed   | Condition                                          |
     * |----------------------|----------------------------------------------------|
     * | VIEW_CHANNEL         | always                                             |
     * | READ_MESSAGE_HISTORY | always                                             |
     * | ADD_REACTIONS        | When no other user has reacted with the emoji used |
     *
     * @example
     * // This example uses a discord emoji
     * let client = new SnowTransfer('TOKEN');
     * client.channel.createReaction('channel Id', 'message Id', encodeURIComponent(':awooo:322522663304036352'));
     *
     * @example
     * // using a utf-8 emoji
     * let client = new SnowTransfer('TOKEN');
     * client.channel.createReaction('channel Id', 'message Id', encodeURIComponent('😀'));
     */
    public async createReaction(channelId: string, messageId: string, emoji: string): Promise<void> {
        return this.requestHandler.request(Routes.channelMessageOwnReaction(channelId, messageId, encodeURIComponent(emoji)), "put", "json");
    }

    /**
     * Delete a reaction added by the current user from a message
     * @param channelId Id of the channel
     * @param messageId Id of the message
     * @param emoji reaction emoji
     * @returns Resolves the Promise on successful execution
     *
     * | Permission           | Condition |
     * |----------------------|-----------|
     * | VIEW_CHANNEL         | always    |
     * | READ_MESSAGE_HISTORY | always    |
     *
     * @example
     * // This example uses a discord emoji
     * let client = new SnowTransfer('TOKEN');
     * client.channel.deleteReactionSelf('channel Id', 'message Id', encodeURIComponent(':awooo:322522663304036352'));
     *
     * @example
     * // using a utf-8 emoji
     * let client = new SnowTransfer('TOKEN');
     * client.channel.deleteReactionSelf('channel Id', 'message Id', encodeURIComponent('😀'));
     */
    public async deleteReactionSelf(channelId: string, messageId: string, emoji: string): Promise<void> {
        return this.requestHandler.request(Routes.channelMessageOwnReaction(channelId, messageId, encodeURIComponent(emoji)), "delete", "json");
    }

    /**
     * Delete a reaction from a message
     * @param channelId Id of the channel
     * @param messageId Id of the message
     * @param emoji reaction emoji
     * @param userId Id of the user
     * @returns Resolves the Promise on successful execution
     *
     * | Permission           | Condition |
     * |----------------------|-----------|
     * | MANAGE_MESSAGES      | always    |
     * | VIEW_CHANNEL         | always    |
     * | READ_MESSAGE_HISTORY | always    |
     *
     * @example
     * // This example uses a discord emoji
     * let client = new SnowTransfer('TOKEN');
     * client.channel.deleteReaction('channel Id', 'message Id', encodeURIComponent(':awooo:322522663304036352'), 'user Id');
     *
     * @example
     * // using a utf-8 emoji
     * let client = new SnowTransfer('TOKEN');
     * // If a user Id is not supplied, the emoji from that message will be removed for all users
     * client.channel.deleteReaction('channel Id', 'message Id', encodeURIComponent('😀'), 'user Id');
     */
    public async deleteReaction(channelId: string, messageId: string, emoji: string, userId?: string): Promise<void> {
        if (!userId) return this.requestHandler.request(Routes.channelMessageReaction(channelId, messageId, encodeURIComponent(emoji)), "delete", "json");
        return this.requestHandler.request(Routes.channelMessageUserReaction(channelId, messageId, encodeURIComponent(emoji), userId), "delete", "json");
    }

    /**
     * Get a list of users that reacted with a certain emoji on a certain message
     * @param channelId Id of the channel
     * @param messageId Id of the message
     * @param emoji reaction emoji
     * @returns Array of [user objects](https://discord.com/developers/docs/resources/user#user-object)
     *
     * | Permissions needed   | Condition |
     * |----------------------|-----------|
     * | VIEW_CHANNEL         | always    |
     * | READ_MESSAGE_HISTORY | always    |
     *
     * @example
     * // This example uses a discord emoji
     * let client = new SnowTransfer('TOKEN');
     * let reactions = await client.channel.getReactions('channel Id', 'message Id', encodeURIComponent(':awooo:322522663304036352'));
     */
    public async getReactions(channelId: string, messageId: string, emoji: string): Promise<APIUser[]> {
        return this.requestHandler.request(Routes.channelMessageReaction(channelId, messageId, encodeURIComponent(emoji)), "get", "json");
    }

    /**
     * Delete all reactions from a message
     * @param channelId Id of the channel
     * @param messageId Id of the message
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed   | Condition |
     * |----------------------|-----------|
     * | VIEW_CHANNEL         | always    |
     * | READ_MESSAGE_HISTORY | always    |
     * | MANAGE_MESSAGES      | always    |
     */
    public async deleteAllReactions(channelId: string, messageId: string): Promise<void> {
        return this.requestHandler.request(Routes.channelMessageAllReactions(channelId, messageId), "delete", "json");
    }

    /**
     * Modify the permission overwrites of a channel
     * @param channelId Id of the channel
     * @param permissionId Id of the permission overwrite
     * @param data modified [permission overwrite](https://discord.com/developers/docs/resources/channel#edit-channel-permissions-json-params) object
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed | Condition                  |
     * |--------------------|----------------------------|
     * | MANAGE_CHANNELS    | if channel is not a thread |
     * | MANAGE_THREADS     | if channel is a thread     |
     * | MANAGE_ROLES       | always                     |
     * | VIEW_CHANNEL       | always                     |
     */
    public async editChannelPermission(channelId: string, permissionId: string, data: Partial<RESTPutAPIChannelPermissionJSONBody>): Promise<void> {
        return this.requestHandler.request(Routes.channelPermission(channelId, permissionId), "put", "json", data);
    }

    /**
     * Delete a permission overwrite from a channel
     * @param channelId Id of the channel
     * @param permissionId Id of the permission overwrite
     * @param reason Reason for deleting the permission
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed | Condition                  |
     * |--------------------|----------------------------|
     * | MANAGE_CHANNELS    | if channel is not a thread |
     * | MANAGE_THREADS     | if channel is a thread     |
     * | MANAGE_ROLES       | always                     |
     * | VIEW_CHANNEL       | always                     |
     */
    public async deleteChannelPermission(channelId: string, permissionId: string, reason?: string): Promise<void> {
        return this.requestHandler.request(Routes.channelPermission(channelId, permissionId), "delete", "json", reason ? { reason } : undefined);
    }

    /**
     * Get a list of invites for a channel
     * @param channelId Id of the channel
     * @returns Array of [invite objects](https://discord.com/developers/docs/resources/invite#invite-object) (with metadata)
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | VIEW_CHANNEL       | always    |
     * | MANAGE_CHANNELS    | always    |
     */
    public async getChannelInvites(channelId: string): Promise<RESTGetAPIChannelInvitesResult> {
        return this.requestHandler.request(Routes.channelInvites(channelId), "get", "json");
    }

    /**
     * Create an invite for a channel
     *
     * If no data argument is passed, the invite will be created with the defaults listed below
     * @param channelId Id of the channel
     * @param data invite data (optional)
     * @returns [Invite object](https://discord.com/developers/docs/resources/invite#invite-object) (with metadata)
     *
     * | Permissions needed    | Condition |
     * |-----------------------|-----------|
     * | VIEW_CHANNEL          | always    |
     * | CREATE_INSTANT_INVITE | always    |
     */
    public async createChannelInvite(channelId: string, data: RESTPostAPIChannelInviteJSONBody = { max_age: 86400, max_uses: 0, temporary: false, unique: false }): Promise<RESTPostAPIChannelInviteResult> {
        return this.requestHandler.request(Routes.channelInvites(channelId), "post", "json", data);
    }

    /**
     * Send an indicator that the current user is typing within a channel.
     *
     * **You should generally avoid this method unless used for longer computations (>1s)**
     * @param channelId Id of the channel
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed       | Condition                    |
     * |--------------------------|------------------------------|
     * | VIEW_CHANNEL             | always                       |
     * | SEND_MESSAGES            | if channel is not a thread   |
     * | SEND_MESSAGES_IN_THREADS | if channel is a thread       |
     */
    public async startChannelTyping(channelId: string): Promise<void> {
        return this.requestHandler.request(Routes.channelTyping(channelId), "post", "json");
    }

    /**
     * Get a list of pinned messages for a channel
     * @param channelId Id of the channel
     * @returns Array of [message objects](https://discord.com/developers/docs/resources/channel#message-object)
     *
     * | Permissions needed   | Condition                      |
     * |----------------------|--------------------------------|
     * | VIEW_CHANNEL         | if channel is not a DM channel |
     * | READ_MESSAGE_HISTORY | if channel is not a DM channel |
     */
    public async getChannelPinnedMessages(channelId: string): Promise<RESTGetAPIChannelPinsResult> {
        return this.requestHandler.request(Routes.channelPins(channelId), "get", "json");
    }

    /**
     * Pin a message within a channel
     * @param channelId Id of the channel
     * @param messageId Id of the message
     * @param reason Reason for pinning the message
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed   | Condition                      |
     * |----------------------|--------------------------------|
     * | VIEW_CHANNEL         | if channel is not a DM channel |
     * | READ_MESSAGE_HISTORY | if channel is not a DM channel |
     * | MANAGE_MESSAGES      | if channel is not a DM channel |
     */
    public async addChannelPinnedMessage(channelId: string, messageId: string, reason?: string): Promise<void> {
        return this.requestHandler.request(Routes.channelPin(channelId, messageId), "put", "json", reason ? { reason } : undefined);
    }

    /**
     * Remove a pinned message from a channel
     * @param channelId Id of the channel
     * @param messageId Id of the message
     * @param reason Reason for removing the pinned message
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed   | Condition                      |
     * |----------------------|--------------------------------|
     * | VIEW_CHANNEL         | if channel is not a DM channel |
     * | READ_MESSAGE_HISTORY | if channel is not a DM channel |
     * | MANAGE_MESSAGES      | if channel is not a DM channel |
     */
    public async removeChannelPinnedMessage(channelId: string, messageId: string, reason?: string): Promise<void> {
        return this.requestHandler.request(Routes.channelPin(channelId, messageId), "delete", "json", reason ? { reason } : undefined);
    }

    /**
     * Creates a public thread off a message in a channel
     * @param channelId Id of the channel
     * @param messageId Id of the message
     * @param options Thread meta data
     * @returns [thread channel](https://discord.com/developers/docs/resources/channel#channel-object) object
     *
     * | Permissions needed    | Condition |
     * |-----------------------|-----------|
     * | VIEW_CHANNEL          | always    |
     * | CREATE_PUBLIC_THREADS | always    |
     */
    public async createThreadWithMessage(channelId: string, messageId: string, options: { name: string; auto_archive_duration: 60 | 1440 | 4320 | 10080; reason?: string; }): Promise<RESTPostAPIChannelThreadsResult> {
        return this.requestHandler.request(Routes.threads(channelId, messageId), "post", "json", options);
    }

    /**
     * Creates a thread under a channel without a message
     * @param channelId Id of the channel
     * @param options Thread meta data
     * @returns [thread channel](https://discord.com/developers/docs/resources/channel#channel-object) object
     *
     * | Permissions needed     | Condition                    |
     * |------------------------|------------------------------|
     * | VIEW_CHANNEL           | always                       |
     * | CREATE_PUBLIC_THREADS  | if creating a public thread  |
     * | CREATE_PRIVATE_THREADS | if creating a private thread |
     */
    public async createThreadWithoutMessage(channelId: string, options: { name: string; auto_archive_duration: 60 | 1440 | 4320 | 10080; type: 10 | 11 | 12; invitable?: boolean; reason?: string; }): Promise<RESTPostAPIChannelThreadsResult> {
        return this.requestHandler.request(Routes.threads(channelId), "post", "json", options);
    }

    /**
     * Join a thread
     * @param channelId Id of the channel
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | VIEW_CHANNEL       | always    |
     */
    public async joinThread(channelId: string): Promise<void> {
        return this.requestHandler.request(Routes.threadMembers(channelId, "@me"), "put", "json");
    }

    /**
     * Add a user to a thread
     * @param channelId Id of the channel
     * @param userId Id of the user to add
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed          | Condition |
     * |-----------------------------|-----------|
     * | CurrentUser added to Thread | always    |
     * | SEND_MESSAGES_IN_THREADS    | always    |
     */
    public async addThreadMember(channelId: string, userId: string): Promise<void> {
        return this.requestHandler.request(Routes.threadMembers(channelId, userId), "put", "json");
    }

    /**
     * Leave a thread
     * @param channelId Id of the channel
     * @returns Resolves the Promise on successful execution
     */
    public async leaveThread(channelId: string): Promise<void> {
        return this.requestHandler.request(Routes.threadMembers(channelId, "@me"), "delete", "json");
    }

    /**
     * Remove a user from a thread
     * @param channelId Id of the channel
     * @param userId Id of the user to remove
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed | Condition                                            |
     * |--------------------|------------------------------------------------------|
     * | MANAGE_THREADS     | if the current user is not the creator of the thread |
     */
    public removeThreadMember(channelId: string, userId: string): Promise<void> {
        return this.requestHandler.request(Routes.threadMembers(channelId, userId), "delete", "json");
    }

    /**
     * Gets all members within a thread
     * @param channelId Id of the Thread
     * @returns Array of [thread member objects](https://discord.com/developers/docs/resources/channel#thread-member-object)
     *
     * | Permissions needed           | Condition |
     * |------------------------------|-----------|
     * | VIEW_CHANNEL                 | always    |
     * | GUILD_MEMBERS gateway intent | always    |
     */
    public async getChannelThreadMembers(channelId: string): Promise<RESTGetAPIChannelThreadMembersResult> {
        return this.requestHandler.request(Routes.threadMembers(channelId), "get", "json");
    }

    /**
     * Gets all threads that are private and archived within a GuildChannel
     * @param channelId Id of the Channel
     * @returns Array of [channel objects with message_count, member_count, thread_metadata and optional member fields](https://discord.com/developers/docs/resources/channel#channel-object)
     *
     * | Permissions needed          | Condition                                  |
     * |-----------------------------|--------------------------------------------|
     * | VIEW_CHANNEL                | always                                     |
     * | CurrentUser added to Thread | if CurrentUser doesn't have MANAGE_THREADS |
     * | MANAGE_THREADS              | if CurrentUser isn't added to Thread       |
     */
    public async getChannelArchivedPrivateThreads(channelId: string, data: RESTGetAPIChannelThreadsArchivedQuery = {}): Promise<RESTGetAPIChannelUsersThreadsArchivedResult> {
        return this.requestHandler.request(Routes.channelThreads(channelId, "private"), "get", "json", data);
    }

    /**
     * Gets all threads that are private and archived within a GuildChannel that the CurrentUser is apart of
     * @param channelId Id of the Channel
     * @returns Array of [channel objects with message_count, member_count, thread_metadata and optional member fields](https://discord.com/developers/docs/resources/channel#channel-object)
     *
     * | Permissions needed                | Condition                                  |
     * |-----------------------------------|--------------------------------------------|
     * | VIEW_CHANNEL                      | always                                     |
     * | CurrentUser added to Thread       | if CurrentUser doesn't have MANAGE_THREADS |
     * | MANAGE_THREADS                    | if CurrentUser isn't added to Thread       |
     */
    public async getChannelArchivedPrivateThreadsUser(channelId: string, data: RESTGetAPIChannelThreadsArchivedQuery = {}): Promise<RESTGetAPIChannelUsersThreadsArchivedResult> {
        return this.requestHandler.request(Routes.channelJoinedArchivedThreads(channelId), "get", "json", data);
    }

    /**
     * Gets all threads that are public and archived within a GuildChannel
     * @param channelId Id of the Channel
     * @returns Array of [channel objects with message_count, member_count, thread_metadata and optional member fields](https://discord.com/developers/docs/resources/channel#channel-object)
     *
     * | Permissions needed          | Condition                                  |
     * |-----------------------------|--------------------------------------------|
     * | VIEW_CHANNEL                | always                                     |
     * | CurrentUser added to Thread | if CurrentUser doesn't have MANAGE_THREADS |
     * | MANAGE_THREADS              | if CurrentUser isn't added to Thread       |
     */
    public async getChannelArchivedPublicThreads(channelId: string, data: RESTGetAPIChannelThreadsArchivedQuery = {}): Promise<RESTGetAPIChannelUsersThreadsArchivedResult> {
        return this.requestHandler.request(Routes.channelThreads(channelId, "public"), "get", "json", data);
    }
}

function replaceEveryone(match: string, target: string) {
    if (target.match(/^[&!]?\d+$/)) {
        return `@${target}`;
    } else {
        return `@\u200b${target}`;
    }
}

type NoUndefined<T> = {
    [P in keyof T]: Exclude<T[P], undefined>
};

type CreateMessageData = NoUndefined<RESTPostAPIChannelMessageJSONBody> & {
    files?: {
        name: string;
        file: Buffer;
    }[];
};

type EditMessageData = NoUndefined<RESTPatchAPIChannelMessageJSONBody> & {
    files?: {
        name: string;
        file: Buffer;
    }[];
};

export = ChannelMethods;