import { setRate } from "../api/setRate";

export async function rateController(
  rate: string,
  modalView: ModalViewType,
  state: AppStateType,
) {
  // 별점을 클릭했을 때, 로컬에 저장 및 렌더링.
  await setRate(state.getCurrentMovie(), rate);
  modalView.renderRate(Number(rate));
  console.log(rate);
}
