![thumbnail-gh](https://user-images.githubusercontent.com/48355572/206574506-a4f3ea19-b32a-4941-91d5-8917e6b3c7ee.png)

# Binoculearn.ai
𝘓𝘦𝘢𝘳𝘯𝘪𝘯𝘨 𝘪𝘯 𝘭𝘰𝘸-𝘣𝘢𝘯𝘥𝘸𝘪𝘥𝘵𝘩 𝘪𝘯𝘵𝘦𝘳𝘯𝘦𝘵 𝘙𝘦𝘥𝘦𝘧𝘪𝘯𝘦𝘥⚡ — Project Submission for MongoDB Atlas Hackathon'22 🍃

**Binoculearn** is a bleeding-edge smart P2P *educational* ***video conferencing web application*** aimed to deliver a *reliable frame rate* & is backed by low-latency support along with low jitter (smooth and consistent), as well as high audio quality. We do this by *converting the video stream into ASCII characters on the client side* and send it via *WebRTC* using [**Twilio’s video conferencing service**](https://www.twilio.com/docs/video) & is fuelled by [**MongoDB Atlas**](https://www.mongodb.com/atlas/database)! 🍃

![image](https://user-images.githubusercontent.com/48355572/206498204-02bf9689-74f3-4bb2-82a6-bf1f3c54de77.png)

💡 Implementing video conferencing using this technique *saves bandwidth bidirectionally* & especially on the receiver end. This method is *horizontally scalable* as we can feed more users as they enter the conference.

---

## Installing / Getting started

There are two folders, where `my-app` is for the front-end & `server` is for the backend. 

### Setting up Dev [Make sure `.env` is loaded with your own credentials]

```shell
git clone https://github.com/Neilblaze/Binoculearn.AI
cd server
npm i
npm start
```

### Setting up Frontend

```shell
git clone https://github.com/Neilblaze/Binoculearn.AI
cd my-app
npm i
npm start
```


P.S.> Open in two different shells in VS code for smooth experience! 

---


### Features 🎠

- P2P lagfree video conferencing app with ultra-low bandwidth support
- Bleeding-edge Image Compression Algorithm
- Horizontally Scaleble [Currently capped at 4, because of Twilio Credits]
- Twilio Live Transcription [Stored in MongoDB Atlas]
- P2P Messaging with Sentiment Analysis via Natural Language API
- Generate Summary of the meeting
- File Sharing (blob) via MongoDB Atlas
- User Dashboard with Previous Activity Tracker
- Minimalist UI/UX powered by ReactJS & Tailwind CSS
- High Quality Multiplexed Audio
- Overall Meeting Emotion Tracker
- MongoDB Atlas as Non-SQL DB
- Saves 💰 + Internet Data
- Secure O-Auth via Firebase by Google
- 100% GDPR compliant & SEO friendly inteface!

### Privacy & Security 🔐
Binoculearn deals with a wide range of sensitive information. In the wrong hands, this data could dramatically harm individuals. We took special efforts and considerations to ensure that our platform protects the privacy and sensitive information of all of our users making it 100% GDPR compliant!

We also made sure that all data is sent securely over the network. Binoculearn leverages the security benefits of TLS for encryption. We also encoded all of our data using Base64 encoding. Ideally, in a future iteration, we would like to encrypt all data using a more secure method.

### Screenshots 🖼️

**Home Page [Before O-Auth]**            |  **Home Page [After O-Auth]**
:-------------------------:|:-------------------------:
![image](https://user-images.githubusercontent.com/48355572/206563085-b95c2b53-e061-46dc-9663-217c36a668fc.png)  |  ![image](https://user-images.githubusercontent.com/48355572/206563927-e84fbfbb-2677-41bc-900e-7cbb3a167334.png) 

**Host a Meeting**            |  **Join a Meeting**
:-------------------------:|:-------------------------:
![image](https://user-images.githubusercontent.com/48355572/206564693-06c567bd-ec04-414d-a51c-365dc6e210a7.png)  |  ![image](https://user-images.githubusercontent.com/48355572/206564807-7775e11e-128f-487e-a6c7-52f56474a9a4.png)

### Description 🦄
Experience a *Superfast*, *low-latency* P2P videochat even on *ultra-low Bandwidth* networks. Redefining the communication gap, Binoculearn is a **MIT licensed** open-sourced project made for students, by the students & will be **Free Forever**! ⚡ 

[![Recording](https://i.postimg.cc/Y0vMJmPM/Recording-2022-12-09-at-01-48-43.gif)](https://www.youtubetrimmer.com/view/?v=zA9G48irhT0&start=91&end=110&loop=0)

☝️ In the above Gif, Gaurang can been seen in ASCII showing the demo.

On top of the bandwidth-saving functionality, we also offer educational and content-moderation tools like **Sentiment Analysis via Google Cloud's [Natural Language API](https://cloud.google.com/natural-language)** for session chat QnA and our custom Trained ML model deployed on GCP for **Meeting Summarization**. 

![image](https://user-images.githubusercontent.com/48355572/206547367-1a1d8b3c-2d2f-4914-b8ac-84acb900da55.png)

These features allow both the educators and students to maintain decorum in the meeting and also have follow-up material to retain information about the meeting!

### License ⚖️
Distributed under the [MIT](https://github.com/Neilblaze/Binoculearn.AI/blob/main/LICENSE) License. See `LICENSE.txt` for more information.


### How we built it ⚙️
First and foremost, it is Crafted with 💙. The whole process can be broken into the following points :-
- ➤ ReactJS, Redux + Tailwind CSS on the frontend
- ➤ Express.js, Node.js, Sockets, WebRTC, Twilio Live on the backend

![image](https://user-images.githubusercontent.com/48355572/206561116-36a9cba5-dd6b-412a-b58b-fba46c370f06.png)

- ➤ Prisma for connecting the Frontend to the DMongoDB Atlas to store user Data + Logs
- ➤ External services like Twilio, GCP Natural Language API
- ➤ GitHub as CI/CD and Vercel for Deployment

![image](https://user-images.githubusercontent.com/48355572/206552694-08336d50-be9a-4672-879a-b380ee4152d2.png)


**QnA model Architecture BERT:**            |  **Summarizer Architecture**
:-------------------------:|:-------------------------:
![image-172.png](https://i.postimg.cc/Wp9sKnGK/image-172.png) | ![image-173.png](https://i.postimg.cc/5t1cjY5L/image-173.png)


➤  **Prisma Schema for MongoDB Atlas:**
![image](https://user-images.githubusercontent.com/48355572/206562434-7e8b63d0-3c28-4460-aa89-68609e280435.png)

---


### Conclusion 🐣
It has been all fun, & I would love to thank my buddies @subhamX & [**Gaurang**](https://www.gaurang-ruparelia.com) for helping me, & Special thanks goes to @stanimiravlaeva, @mlynn & @joel__lord 🙌. And as always, thank you #DEV #DEVCommunity & #MongoDB for hosting this hackathon! 💚
 
**Update ⚠️ — We ran out of credits, hence API credentials have been revoked! If you want to run the same on your local, use your own credentials.**
