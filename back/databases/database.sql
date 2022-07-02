
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Database: `deda_198003`
--
CREATE DATABASE IF NOT EXISTS `deda_198003` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `deda_198003`;

-- --------------------------------------------------------

--
-- Table structure for table `auth`
--

CREATE TABLE  IF NOT EXISTS  `auth` (
  `id` bigint(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `last_log` varchar(25) NOT NULL,
  `password` varchar(150) NOT NULL,
  `verified` tinyint(1) NOT NULL,
  `ucity` varchar(30) NOT NULL,
  `address` varchar(150) NOT NULL,
  `about` varchar(200) NOT NULL,
  `image` varchar(320) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `auth`
--

INSERT INTO `auth` (`id`, `name`, `mobile`, `created_at`, `last_log`, `password`, `verified`, `ucity`, `address`, `about`, `image`) VALUES
(16, 'Savitri Devi', '9565169947', '2021-07-08 16:28:59.273424', '7/25/2021, 2:52:24 AM', '$2b$08$K6rEfu9BCPGuv8RGQA792OnXKMfu3YnCaPLFquLllmiEyGNBZr.K.', 0, '', 'sdgfdfgdfgrgrttger', 'asssss', 'https://gravatar.com/avatar/31b64e4876d603ce78e04102c67d6144?s=80&d=https://codepen.io/assets/avatars/user-avatar-80x80-bdcd44a3bfb9a5fd01eb8b86f9e033fa1a9897c3a15b33adfc2649a002dab1b6.png'),
(17, 'Abhay manpower Agency', '6390130136', '2021-07-08 16:30:59.402495', '8/9/2021, 12:14:37 am', '$2b$08$l/xP9IiUxz.5mT6vmC84IOSp0pp0iYy33a10KyLh7q6Z/iFs7Y3xm', 1, 'Azamgarh ', '235A Bilandpur Near DIG banglow', 'Veery dedicated guy ', 'public\\profile\\profile_17\\ITEM_17..jfif'),
(19, 'omprakash testing and training center', '9450735294', '2021-07-08 23:21:15.457166', '1/9/2021, 9:57:46 pm', '$2b$08$QPt8/iWOXToLt3.l8cJ21uyjfzDhs8Osd04WnlG4pwj74hVU5xd8e', 1, '', '', '', ''),
(22, 'Avinash test and training center', '8181849691', '2021-09-05 02:30:33.864386', '8/9/2021, 1:08:02 am', '$2b$08$scZHaKBesJCULFEDVkaYAOLOpyRFJKnWoI7E1YCQCHCs94dBeMeOW', 0, 'Chandigarh', '636 A', 'bahut bada chutiya', 'public\\profile\\profile_22\\ITEM_22..jfif'),
(23, 'hjwjewqejhwjh', '1234567890', '2021-09-05 02:32:49.064854', '', '$2b$08$XGA8/EaOQzT0Gc9gbOdCqOhAL8e92EUxMUdCbeqRNMTC8Ny7O4x32', 0, '', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE  IF NOT EXISTS  `chat` (
  `id` bigint(150) NOT NULL,
  `msg_from` varchar(50) NOT NULL,
  `msg_to` varchar(50) NOT NULL,
  `msgIn` varchar(1200) NOT NULL,
  `time` varchar(40) NOT NULL,
  `avtr` varchar(120) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `chat`
--

INSERT INTO `chat` (`id`, `msg_from`, `msg_to`, `msgIn`, `time`, `avtr`) VALUES
(260, '17', '19', 'hn', 'Wed Sep 08 2021 13:30:45 GMT+0530 (India Standard Time)', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `postmade`
--

CREATE TABLE  IF NOT EXISTS  `postmade` (
  `postId` int(10) NOT NULL,
  `userId` varchar(20) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `img` varchar(300) DEFAULT NULL,
  `time` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `postmade`
--

INSERT INTO `postmade` (`postId`, `userId`, `city`, `message`, `img`, `time`) VALUES
(33, '2', 'Azamgarh', 'Y h y y ', '\\public\\databases\\post_2\\postMade..jpeg', 'Wed Sep 01 2021 18:30:57 GMT+0530 (India'),
(34, '19', 'Varanasi', 'Message', '\\public\\databases\\post_19\\postMade..jpeg', 'Wed Sep 01 2021 19:04:58 GMT+0530 (India'),
(35, '17', 'Nalbari', 'kya dikhau bhai', '\\public\\databases\\post_17\\postMade..png', 'Wed Sep 01 2021 21:52:18 GMT+0530 (India'),
(47, '22', 'Godhra', 'avinash nam h lwde', 'public\\databases\\post_22\\ITEM_575..jfif', 'Sun Sep 05 2021 02:42:38 GMT+0530 (India'),
(48, '22', 'Chatra', 'jute lal', 'public\\databases\\post_22\\ITEM_562..jpeg', 'Wed Sep 08 2021 01:10:50 GMT+0530 (India'),
(49, '17', 'Azamgarh', 'gdfgdfgfggdfg', 'public\\databases\\post_17\\ITEM_97..png', 'Wed Sep 08 2021 13:41:37 GMT+0530 (India');

-- --------------------------------------------------------

--
-- Table structure for table `roomid`
--

CREATE TABLE  IF NOT EXISTS  `roomid` (
  `roomId` int(10) NOT NULL,
  `userId_1` varchar(10) DEFAULT NULL,
  `userId_2` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roomid`
--

INSERT INTO `roomid` (`roomId`, `userId_1`, `userId_2`) VALUES
(14, '17', '2'),
(15, '17', '17'),
(16, '19', '17'),
(17, '19', '19'),
(18, '19', '22'),
(19, '22', '17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auth`
--
ALTER TABLE `auth`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `postmade`
--
ALTER TABLE `postmade`
  ADD PRIMARY KEY (`postId`);

--
-- Indexes for table `roomid`
--
ALTER TABLE `roomid`
  ADD PRIMARY KEY (`roomId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auth`
--
ALTER TABLE `auth`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `chat`
--
ALTER TABLE `chat`
  MODIFY `id` bigint(150) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=261;

--
-- AUTO_INCREMENT for table `postmade`
--
ALTER TABLE `postmade`
  MODIFY `postId` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `roomid`
--
ALTER TABLE `roomid`
  MODIFY `roomId` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
--
