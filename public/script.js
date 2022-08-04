const form = document.querySelector("#uploadForm");

const sendFiles = async () => {
  const myFiles = document.getElementById("myfiles").files;

  const formData = new FormData();

  Object.keys(myFiles).forEach((key) => {
    formData.append(myFiles[key].name, myFiles[key]);
  });

  const response = await fetch("http://localhost:5000/files/upload", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZThkN2MzNDhkNDVkMzkzN2I2NzJiMyIsImZpcnN0bmFtZSI6IktvdXJvc2giLCJsYXN0bmFtZSI6IkRhbWVyY2hlbGkiLCJ1c2VybmFtZSI6ImtkY2hlbGkiLCJlbWFpbCI6ImtkYW1lcmNoZWxpQHltYWlsLmNvbSIsImZyaWVuZHMiOltdLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTAyVDA3OjUyOjM1LjcxNVoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTAyVDA3OjUyOjM1LjcxNVoiLCJfX3YiOjAsImlhdCI6MTY1OTUxNTg2NywiZXhwIjoxNjU5NjAyMjY3fQ.7HhEscB8zfmDJoL29cYXYzTpGuKVoPvU8-0DW4yfVxc`,
    },
  });

  const data = await response.json();

  const h2 = document.querySelector("h2");
  h2.textContent = `Status: ${data.status}`;

  const h3 = document.querySelector("h3");
  h3.textContent = `Message: ${data.message}`;

  console.log(data);
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  sendFiles();
});
