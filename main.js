acode.setPluginInit('bongo.cat.typing', (baseUrl) => {
  if (!baseUrl.endsWith('/')) baseUrl += '/';

  const stayImg = baseUrl + 'bongo/stay.png';
  const clickImg = baseUrl + 'bongo/click.png';

  const $container = document.createElement('div');
  
  Object.assign($container.style, {
    position: 'fixed',
    top: '70px',
    right: '20px',
    width: '160px', // Размер в 2 раза больше
    height: 'auto',
    zIndex: '9999',
    pointerEvents: 'none'
  });

  const $img = document.createElement('img');
  $img.src = stayImg;
  $img.style.width = '100%';
  $img.style.display = 'block';
  // Убираем любые трансформации, чтобы картинка не дергалась
  $img.style.transform = 'none'; 
  
  $container.appendChild($img);
  document.body.appendChild($container);

  let timeout;

  const handleTyping = () => {
    // Если уже была картинка нажатия, она просто останется
    if ($img.src !== clickImg) {
      $img.src = clickImg;
    }

    // Сбрасываем таймер при каждом нажатии
    if (timeout) clearTimeout(timeout);

    // Чем быстрее печатаешь, тем чаще обновляется этот таймер.
    // Кот вернется в "stay" только когда наступит пауза в 200мс.
    timeout = setTimeout(() => {
      $img.src = stayImg;
    }, 200); // 200мс — оптимально для быстрой печати
  };

  const editor = editorManager.editor;
  editor.on('change', handleTyping);

  window.bongoCatPlugin = {
    destroy: () => {
      $container.remove();
      editor.off('change', handleTyping);
    }
  };
});

acode.setPluginUnmount('bongo.cat.typing', () => {
  if (window.bongoCatPlugin) {
    window.bongoCatPlugin.destroy();
    delete window.bongoCatPlugin;
  }
});