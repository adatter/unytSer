// Routes to be rendered on the client

import { UIX } from "uix";

UIX.Theme.registerTheme({
  name: "blank",
  mode: undefined,
  stylesheets: [],
});

UIX.Theme.useThemes("blank"); 

export default {
	'/': import("./main.tsx"),
}
