import * as types from "./types";

import { ActionTree } from "vuex";
import state from "./state";
export type RootState = ReturnType<typeof state>;

const actions: ActionTree<RootState, RootState> = {};

export default actions;
