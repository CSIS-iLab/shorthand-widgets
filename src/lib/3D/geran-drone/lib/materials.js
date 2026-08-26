export function createMaterialController(getApi) {
  let currentOpacities = new Map();
  let activeFadeInterval = null;

  function highlightComponent(materialName, cameraPos, cameraTarget) {
    const api = getApi();
    if (!api) return console.warn('Sketchfab API not ready.');

    api.setCameraLookAt(cameraPos, cameraTarget, 2);
    api.setHighlightOptions({
      outlineWidth: 2,
      outlineColor: [1, 0.1, 0.1],
      outlineDuration: 200,
      highlightColor: [1, 0.1, 0.1],
      highlightDuration: 200,
    });

    api.getMaterialList((err, materials) => {
      if (err || !materials) return;
      const target = materials.find(
        (m) => m.name.trim().toLowerCase() === materialName.trim().toLowerCase()
      );
      if (target) api.highlightMaterial(target);
      else console.warn(`Material "${materialName}" not found`);
    });
  }

  function fadeOpacities(getFinalTargetFactor, duration = 500) {
    const api = getApi();
    if (!api) return;
    if (activeFadeInterval) clearInterval(activeFadeInterval);

    api.getMaterialList((err, materials) => {
      if (err || !materials) return;

      materials.forEach((mat) => {
        const name = mat.name.toLowerCase();
        if (!currentOpacities.has(name))
          currentOpacities.set(name, mat.channels?.Opacity?.factor ?? 1.0);
      });

      const items = materials
        .map((mat) => {
          const name = mat.name.toLowerCase();
          const start = currentOpacities.get(name);
          const target = getFinalTargetFactor(name);
          return { material: mat, name, start, target, needsUpdate: Math.abs(start - target) > 0.01 };
        })
        .filter((i) => i.needsUpdate);

      if (!items.length) return;

      const steps = 8;
      const stepDuration = Math.max(duration / steps, 30);
      let currentStep = 0;

      activeFadeInterval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        items.forEach(({ material, name, start, target }) => {
          if (material.channels?.Opacity) {
            const factor = start + (target - start) * progress;
            currentOpacities.set(name, factor);
            material.channels.Opacity.enable = true;
            material.channels.Opacity.factor = factor;
            try { api.setMaterial(material); } catch (e) { /* skip */ }
          }
        });

        if (currentStep >= steps) clearInterval(activeFadeInterval);
      }, stepDuration);
    });
  }

  return {
    resetMaterialOpacities() {
      fadeOpacities((name) => (name === 'missile' || name === 'munitions') ? 0.0 : 1.0);
    },
    focusComponentXRay(targetMaterialName = 'warheads', ghostOpacity = 0.1) {
      highlightComponent(targetMaterialName, [-0.02, 1.98, 0.53], [-0.01, -0.19, -0.64]);
      fadeOpacities((name) => {
        if (['warheads', 'warhead', targetMaterialName.toLowerCase()].includes(name)) return 1.0;
        if (name === 'missile' || name === 'munitions') return 0.0;
        return ghostOpacity;
      });
    },
    showHiddenComponent(targetMaterialName, cameraPos, cameraTarget) {
      highlightComponent(targetMaterialName, cameraPos, cameraTarget);
      fadeOpacities((name) => {
        if (name === targetMaterialName.toLowerCase()) return 1.0;
        if (name === 'missile' || name === 'munitions') return 0.0;
        return 1.0;
      });
    },
    highlightAirframe: ()        => highlightComponent('Frame',          [0, 3, 3],              [0, 0, 0]),
    highlightPropulsion: ()      => highlightComponent('propulsion',     [-0.37, -3.08, 0.88],   [-0.01, -1.86, 0.02]),
    highlightNavigation: ()      => highlightComponent('Navigation',     [-0.97, 1.37, 1.44],    [0.49, -0.02, -0.24]),
    highlightSatNav: ()          => highlightComponent('SatNav',         [0.6, 0.07, 0.61],      [0.47, -0.38, 0.15]),
    highlightCommunication: ()   => highlightComponent('Communication', [2.12, -2.6, 0.38],     [-0.4, -0.63, -0.62]),
  };
}
