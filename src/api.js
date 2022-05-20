export async function getFoods({
  order = "createdAt",
  cursor = "",
  limit = 10,
  search = "",
}) {
  const query = `order=${order}&cursor=${cursor}&limit=${limit}&search=${search}`;
  const response = await fetch(`https://learn.codeit.kr/6301/foods?${query}`);
  if (!response.ok) {
    throw new Error("에러가 발생하였습니다. 다시 확인해 주십시오.");
  }
  const body = await response.json();
  return body;
}
