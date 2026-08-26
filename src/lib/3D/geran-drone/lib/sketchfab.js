import '$lib/js/sketchfab-viewer-1.12.1';

const MODEL_UID = '10382bef344c4a88abb4d1723b339fd4';

const VIEWER_OPTIONS = {
  autostart: 1, transparent: 1,
  ui_watermark: 0, ui_help: 0, ui_settings: 0,
  camera: 1, preload: 1, ui_stop: 0,
  ui_animations: 0, ui_annotations: 0, ui_controls: 0,
  ui_fullscreen: 0, ui_general_controls: 0, ui_hint: 0,
  ui_infos: 0, ui_inspector: 0, ui_vr: 1, ui_watermark_link: 0,
};

export function initSketchfab(iframeEl, { onReady, onError }) {
  if (!iframeEl) return;

  const client = new window.Sketchfab('1.12.1', iframeEl);

  client.init(MODEL_UID, {
    ...VIEWER_OPTIONS,
    success(api) {
      api.start();
      api.addEventListener('viewerready', () => {
        onReady(api);

        // Dev camera logger

        // Hide Missile & Munitions on load
        api.getMaterialList((err, materials) => {
          if (err || !materials) return;
          materials.forEach((mat) => {
            const name = mat.name.toLowerCase();
            if ((name === 'missile' || name === 'munitions') && mat.channels?.Opacity) {
              mat.channels.Opacity.enable = true;
              mat.channels.Opacity.factor = 0.0;
              api.setMaterial(mat);
            }
          });
        });
      });
    },
    error: onError ?? (() => console.error('Sketchfab failed to initialize.')),
  });
}
