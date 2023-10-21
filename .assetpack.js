import { compressWebp } from "@assetpack/plugin-compress";
import { pixiManifest } from "@assetpack/plugin-manifest";
import { pixiTexturePacker } from '@assetpack/plugin-texture-packer';

export default {
	entry: "./assets-src",
	output: "./public",
	plugins: {
		compressWebp: compressWebp(),
		texture: pixiTexturePacker({
			texturePacker: {
				removeFileExtension: true,
			},
		}),
		manifest: pixiManifest(),
	},
};