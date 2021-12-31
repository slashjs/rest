import type { RESTGetAPICurrentUserGuildsQuery, RESTGetAPICurrentUserGuildsResult, RESTGetAPICurrentUserResult, RESTGetAPIUserResult, RESTPatchAPICurrentUserJSONBody, RESTPatchAPICurrentUserResult, RESTPostAPICurrentUserCreateDMChannelResult } from "discord-api-types";
import { Routes } from "../Endpoints";

/**
 * Methods for interacting with users
 */
class UserMethods {
    public requestHandler: import("../RequestHandler");

    /**
     * Create a new User Method handler
     *
     * Usually SnowTransfer creates a method handler for you, this is here for completion
     *
     * You can access the methods listed via `client.user.method`, where `client` is an initialized SnowTransfer instance
     * @param requestHandler
     */
    public constructor(requestHandler: import("../RequestHandler")) {
        this.requestHandler = requestHandler;
    }

    /**
     * Get information about current user
     * @returns [user object](https://discord.com/developers/docs/resources/user#user-object)
     */
    public async getSelf(): Promise<RESTGetAPICurrentUserResult> {
        return this.requestHandler.request(Routes.user(), "get", "json");
    }

    /**
     * Get information about a user via Id
     * @param userId Id of the user
     * @returns [user object](https://discord.com/developers/docs/resources/user#user-object)
     */
    public async getUser(userId: string): Promise<RESTGetAPIUserResult> {
        return this.requestHandler.request(Routes.user(userId), "get", "json");
    }

    /**
     * Update the current user
     * @returns [user object](https://discord.com/developers/docs/resources/user#user-object)
     *
     * @example
     * // update the avatar of the user
     * let client = new SnowTransfer('TOKEN');
     * let fileData = fs.readFileSync('new_avatar.png') // You should probably use fs.readFile, since it's asynchronous, synchronous methods may lag your bot.
     * let updateData = {
     *   avatar: `data:image/png;base64,${fileData.toString('base64')}` // base64 data url: data:mimetype;base64,base64String
     * }
     * client.user.updateSelf(updateData)
     */
    public async updateSelf(data: RESTPatchAPICurrentUserJSONBody): Promise<RESTPatchAPICurrentUserResult> {
        return this.requestHandler.request(Routes.user(), "patch", "json", data);
    }

    /**
     * Get guilds of the current user
     * @returns Array of [partial guild objects](https://discord.com/developers/docs/resources/guild#guild-object)
     */
    public async getGuilds(options: RESTGetAPICurrentUserGuildsQuery = {}): Promise<RESTGetAPICurrentUserGuildsResult> {
        return this.requestHandler.request(Routes.userGuilds(), "get", "json", options);
    }

    /**
     * Leave a guild
     * @param guildId Id of the guild
     * @returns Resolves the Promise on successful execution
     */
    public async leaveGuild(guildId: string): Promise<void> {
        return this.requestHandler.request(Routes.userGuild(guildId), "delete", "json");
    }

    /**
     * Create a direct message channel with another user
     *
     * **You can not create a dm with another bot**
     * @param userId Id of the user to create the direct message channel with
     * @returns [DM channel](https://discord.com/developers/docs/resources/channel#channel-object)
     *
     * @example
     * // Create a dm channel and send "hi" to it
     * let client = new SnowTransfer('TOKEN');
     * let channel = await client.user.createDirectMessageChannel('other user id')
     * client.channel.createMessage(channel.id, 'hi')
     */
    public async createDirectMessageChannel(userId: string): Promise<RESTPostAPICurrentUserCreateDMChannelResult> {
        return this.requestHandler.request(Routes.userChannels(), "post", "json", { recipient_id: userId });
    }
}

export = UserMethods;
