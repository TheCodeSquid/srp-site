import mixins from "postcss-mixins";
import nesting from "postcss-nesting";

export default {
  plugins: [mixins(), nesting()]
};
