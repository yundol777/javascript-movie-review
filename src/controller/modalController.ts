import { getDetail } from "../api/getDetail";

export async function modalController(id: string, modalView: ModalViewType) {
  try {
    const movieDetail = await getDetail(Number(id));
    modalView.render(movieDetail);
  } catch (error) {}
}
