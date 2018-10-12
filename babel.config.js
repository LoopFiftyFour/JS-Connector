module.exports = function (api) {
	
	api.cache(false);
	
  const presets = [
    [
      "@babel/preset-env",
      {
        "targets": {
		  "chrome": "58",
		  "ie": "11"
		}
      }
    ]
  ];
  const plugins = [ ];

  return {
    presets,
    plugins
  };
}