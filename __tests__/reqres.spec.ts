import axios, { AxiosResponse } from "axios";

interface ServerResponse {
  data: UserData[];
  page: number;
  per_page: number;
  support: any;
  total: number;
  total_pages: number;
}

interface UserData {
  avatar: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
}

describe("API testing of reqres.in", () => {
  test("Verify in GET users that total users is correct = 12", async () => {
    const res = <AxiosResponse>await axios.get(`https://reqres.in/api/users`);
    const data: ServerResponse = res.data;
    expect(data.total).toEqual(12);
  });
  test("Verify in GET users that response status code = 200", async () => {
    const res = <AxiosResponse>await axios.get(`https://reqres.in/api/users`);
    expect(res.status).toEqual(200);
  });

  test("Verify in GET users that data response contains user Tracey Ramos", async () => {
    const res = <AxiosResponse>await axios.get(`https://reqres.in/api/users`);
    const data: ServerResponse = res.data;
    let usersArray: UserData[] = data.data;

    for (let page = 2; page <= data.total_pages; page++) {
      const res = <AxiosResponse>(
        await axios.get(`https://reqres.in/api/users?page=${page}`)
      );
      const newUsers: UserData[] = res.data.data;
      usersArray.push(...newUsers);
    }
    expect(usersArray).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          first_name: "Tracey",
          last_name: "Ramos"
        })
      ])
    );
  });

  test("Verify in POST users that response status and data are correct", async () => {
    const res = <AxiosResponse>await axios.post(`https://reqres.in/api/users`, {
      name: "kattest1",
      job: "devkattest1"
    });
    expect(res.status).toEqual(201);

    expect(res.data).toEqual(
      expect.objectContaining({
        name: "kattest1",
        job: "devkattest1"
      })
    );

    expect(new Date(res.data.createdAt).getTime()).toBeGreaterThanOrEqual(
      new Date().getTime()
    );
  });
});
