import { setRate } from "../api/setRate";

export async function rateController(
  rate: string,
  modalView: ModalViewType,
  state: AppStateType,
) {
  await setRate(state.getCurrentMovie(), rate);
  modalView.renderRate(Number(rate));
}
