import { getDetail } from "../api/getDetail";
import { getRate } from "../api/getRate";

export async function modalController(
  id: string,
  modalView: ModalViewType,
  state: AppStateType,
) {
  try {
    modalView.skeletonRender();
    const movieDetail = await getDetail(Number(id));
    state.setCurrentMovie(id);

    const myRate = await getRate(id);
    if (myRate === null) {
      modalView.render(movieDetail, 0);
      return;
    }
    modalView.render(movieDetail, Number(myRate));
  } catch (error) {}
}
