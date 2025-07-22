const { nanoid } = require('nanoid');
const ShortUrl = require('../models/ShortUrl');

exports.createShortUrl = async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) return res.status(400).json({ error: 'URL обязателен' });

  const shortId = nanoid(6);
  const shortUrl = new ShortUrl({ originalUrl, shortId });
  await shortUrl.save();

  res.json({
    shortUrl: `${req.protocol}://${req.get('host')}/s/${shortId}`
  });
};

exports.redirectToOriginal = async (req, res) => {
  const { shortId } = req.params;
  const entry = await ShortUrl.findOne({ shortId });

  if (!entry) return res.status(404).send('Ссылка не найдена');

  res.redirect(entry.originalUrl);
};
