//META{"name":"Encryption","displayName":"Encryption","website":"https://github.com/auxsyo/BetterDiscordPlugins","source":"https://raw.githubusercontent.com/auxsyo/BetterDiscordPlugins/master/Encryption.plugin.js"}*//


var Encryption = (() => {
    const config = {
        "info": { "name": "Encryption", "authors": [{ "name": "auxsyo", "discord_id": "263491576855134208", "github_username": "auxsyo", "twitter_username": "auxsyo" }], "version": "0.4.0", "description": "Encrypt text by [[TEXT]] -> 'VkVWWVZBPT0=' and Decrypt text by {{VkVWWVZBPT0=}} -> 'TEXT' ", "github": "https://github.com/auxsyo/BetterDiscordPlugins", "github_raw": "https://raw.githubusercontent.com/auxsyo/BetterDiscordPlugins/master/Encryption.plugin.js" }};

    return !global.ZeresPluginLibrary ? class {
        constructor() { this._config = config; }
        getName() { return config.info.name; }
        getAuthor() { return config.info.authors.map(a => a.name).join(", "); }
        getDescription() { return config.info.description; }
        getVersion() { return config.info.version; }
        load() {
            const title = "Library Missing";
            const ModalStack = BdApi.findModuleByProps("push", "update", "pop", "popWithKey");
            const TextElement = BdApi.findModuleByProps("Sizes", "Weights");
            const ConfirmationModal = BdApi.findModule(m => m.defaultProps && m.key && m.key() == "confirm-modal");
            if (!ModalStack || !ConfirmationModal || !TextElement) return BdApi.alert(title, `The library plugin needed for ${config.info.name} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);
            ModalStack.push(function (props) {
                return BdApi.React.createElement(ConfirmationModal, Object.assign({
                    header: title,
                    children: [BdApi.React.createElement(TextElement, { color: TextElement.Colors.PRIMARY, children: [`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`] })],
                    red: false,
                    confirmText: "Download Now",
                    cancelText: "Cancel",
                    onConfirm: () => {
                        require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                            if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                            await new Promise(r => require("fs").writeFile(require("path").join(ContentManager.pluginsFolder, "0PluginLibrary.plugin.js"), body, r));
                        });
                    }
                }, props));
            });
        }
        start() { }
        stop() { }
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Library) => {

            const { Logger, DiscordModules, Patcher, Settings } = Library;

            return class Encryption extends Plugin {


                onStart() {
                    Logger.log("Started");

                    Patcher.before(DiscordModules.MessageActions, "sendMessage", (t, a) => {
                        let content = a[1].content;
                        let regex = /\{\{(?:(?:(?:(o|b))?,?)?(?:(r)(\d+(?:\.\d+)?)?,?)?(?:(\d+(?:\.\d+)?)-)?(\d+(?:\.\d+)?)?\:)?((?:(?!{{).)*?)\}\}/g;
                        if (regex.test(content)) {
                            content = content.replace(regex, this.doDecryption.bind(this));
                            if (content.length > 2000) {
                                PluginUtilities.showToast("This message would exceed the 2000-character limit.\nReduce corruption amount or shorten text.\n\nLength including corruption: " + value.length, { type: 'error' });
                                e.preventDefault();
                                return;
                            }
                            a[1].content = content;
                        }
                    });

                    Patcher.before(DiscordModules.MessageActions, "sendMessage", (t, a) => {
                        let content = a[1].content;
                        let regex = /\[\[(?:(?:(?:(o|b))?,?)?(?:(r)(\d+(?:\.\d+)?)?,?)?(?:(\d+(?:\.\d+)?)-)?(\d+(?:\.\d+)?)?\:)?((?:(?!{{).)*?)\]\]/g;
                        if (regex.test(content)) {
                            content = content.replace(regex, this.doEncryption.bind(this));
                            if (content.length > 2000) {
                                PluginUtilities.showToast("This message would exceed the 2000-character limit.\nReduce corruption amount or shorten text.\n\nLength including corruption: " + value.length, { type: 'error' });
                                e.preventDefault();
                                return;
                            }
                            a[1].content = content;
                        }
                    });

                    this.update();
                }

                onStop() {
                    /// Using patch method for now
                    //let textArea = this.getChatTextArea();
                    //if (textArea) textArea.off("keydown.Encryption");
                    Patcher.unpatchAll();
                    Logger.log("Stopped");
                }




                getChatTextArea() {
                    return $(".slateTextArea-1bp44y");
                    //let sel = ZLibrary.DiscordSelectors;
                    //return $(sel.Textarea.channelTextArea.value + " " + sel.Textarea.textArea.value);
                }

                doEncryption(match, midMode, ramp, rampEnd, startAmt, endAmt, contents) {

                    return this.getEncryption(contents, parseFloat(rampEnd), parseFloat(startAmt), parseFloat(endAmt));
                }

                getEncryption(txt) {
                   	let newTxt = "";
                  	newTxt = btoa(txt);
                	newTxt = btoa(newTxt);
                	let len = txt.length;
                	if (len == 0) return "";
                	// Send Encryption
                	return newTxt;
                }

                doDecryption(match, midMode, ramp, rampEnd, startAmt, endAmt, contents) {

                    return this.getDecryption(contents, parseFloat(rampEnd), parseFloat(startAmt), parseFloat(endAmt));
                }

                getDecryption(txt) {
                   	let newTxt = "";
                  	newTxt = atob(txt);
                	newTxt = atob(newTxt);
                	let len = txt.length;
                	if (len == 0) return "";
                	// Send Encryption
                	return newTxt;
                }

                


                

            };

        };
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
