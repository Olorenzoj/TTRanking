-- MySQL dump 10.13  Distrib 9.2.0, for Win64 (x86_64)
--
-- Host: hopper.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
                                      `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                                      `checksum` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                                      `finished_at` datetime(3) DEFAULT NULL,
                                      `migration_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                                      `logs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
                                      `rolled_back_at` datetime(3) DEFAULT NULL,
                                      `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                                      `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
                                      PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
                              `id` int NOT NULL AUTO_INCREMENT,
                              `nombre` enum('1era','2da','3era','4ta') NOT NULL,
                              `elo_inicial` float NOT NULL,
                              PRIMARY KEY (`id`),
                              UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'1era',1000),(2,'2da',800),(3,'3era',600),(4,'4ta',400);
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clubes`
--

DROP TABLE IF EXISTS `clubes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clubes` (
                          `id` int NOT NULL AUTO_INCREMENT,
                          `nombre` varchar(100) NOT NULL,
                          PRIMARY KEY (`id`),
                          UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clubes`
--

LOCK TABLES `clubes` WRITE;
/*!40000 ALTER TABLE `clubes` DISABLE KEYS */;
INSERT INTO `clubes` VALUES (7,'ACHTM'),(30,'AIA'),(22,'ANLU'),(29,'ATTA'),(19,'CPL'),(13,'CRC'),(23,'CTMCH'),(11,'CTMDB'),(27,'CTMH'),(8,'CTMPO'),(14,'CTMV'),(9,'EP'),(21,'FSH'),(25,'Herrera'),(20,'M8'),(18,'MiBus'),(15,'SDAN'),(10,'Sin Club'),(12,'SPI'),(17,'TTTC'),(16,'UDI'),(26,'UP'),(28,'USA'),(24,'USMA');
/*!40000 ALTER TABLE `clubes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_categorias`
--

DROP TABLE IF EXISTS `historial_categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_categorias` (
                                        `id` int NOT NULL AUTO_INCREMENT,
                                        `jugador_id` int NOT NULL,
                                        `categoria_anterior` int DEFAULT NULL,
                                        `categoria_nueva` int NOT NULL,
                                        `fecha_cambio` datetime DEFAULT CURRENT_TIMESTAMP,
                                        `motivo` enum('Ascenso','Descenso','Ajuste','Inicial') NOT NULL,
                                        `torneo_id` int DEFAULT NULL,
                                        PRIMARY KEY (`id`),
                                        KEY `jugador_id` (`jugador_id`),
                                        KEY `categoria_anterior` (`categoria_anterior`),
                                        KEY `categoria_nueva` (`categoria_nueva`),
                                        KEY `torneo_id` (`torneo_id`),
                                        CONSTRAINT `historial_categorias_ibfk_1` FOREIGN KEY (`jugador_id`) REFERENCES `jugadores` (`id`) ON DELETE CASCADE,
                                        CONSTRAINT `historial_categorias_ibfk_2` FOREIGN KEY (`categoria_anterior`) REFERENCES `categorias` (`id`) ON DELETE SET NULL,
                                        CONSTRAINT `historial_categorias_ibfk_3` FOREIGN KEY (`categoria_nueva`) REFERENCES `categorias` (`id`) ON DELETE CASCADE,
                                        CONSTRAINT `historial_categorias_ibfk_4` FOREIGN KEY (`torneo_id`) REFERENCES `torneos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_categorias`
--

LOCK TABLES `historial_categorias` WRITE;
/*!40000 ALTER TABLE `historial_categorias` DISABLE KEYS */;
INSERT INTO `historial_categorias` VALUES (1,53,1,2,'2025-07-06 17:02:27','Descenso',7),(2,55,1,2,'2025-07-06 17:02:27','Descenso',7),(3,268,1,2,'2025-07-06 17:02:27','Descenso',7),(4,51,1,2,'2025-07-06 17:02:27','Descenso',7),(5,52,1,2,'2025-07-06 17:02:27','Descenso',7),(6,54,1,2,'2025-07-06 17:02:27','Descenso',7),(7,138,2,3,'2025-07-06 17:04:54','Descenso',7),(8,139,2,3,'2025-07-06 17:04:54','Descenso',7),(9,140,2,3,'2025-07-06 17:04:54','Descenso',7),(10,136,2,3,'2025-07-06 17:04:54','Descenso',7),(11,141,2,3,'2025-07-06 17:04:54','Descenso',7),(12,142,2,3,'2025-07-06 17:04:54','Descenso',7);
/*!40000 ALTER TABLE `historial_categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jugadores`
--

DROP TABLE IF EXISTS `jugadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jugadores` (
                             `id` int NOT NULL AUTO_INCREMENT,
                             `nombre` varchar(100) NOT NULL,
                             `elo` float DEFAULT NULL,
                             `club_id` int NOT NULL,
                             `categoria_id` int NOT NULL,
                             `ultimo_torneo_id` int DEFAULT NULL,
                             PRIMARY KEY (`id`),
                             KEY `club_id` (`club_id`),
                             KEY `categoria_id` (`categoria_id`),
                             KEY `ultimo_torneo_id` (`ultimo_torneo_id`),
                             CONSTRAINT `jugadores_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `clubes` (`id`) ON DELETE CASCADE,
                             CONSTRAINT `jugadores_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE,
                             CONSTRAINT `jugadores_ibfk_3` FOREIGN KEY (`ultimo_torneo_id`) REFERENCES `torneos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=276 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jugadores`
--

LOCK TABLES `jugadores` WRITE;
/*!40000 ALTER TABLE `jugadores` DISABLE KEYS */;
INSERT INTO `jugadores` VALUES (15,'Renier Sosa',1160,21,1,NULL),(16,'Rene Schaible',1161,21,1,7),(17,'Jean Carlos Tuñon',1097,21,1,NULL),(18,'Jhomar Jimenez',1095,19,1,NULL),(19,'Felipe Leon',1086,19,1,NULL),(20,'Mirabela Tudor',1095,22,1,7),(21,'Edgar Guerra',1083,8,1,7),(22,'Alejandro Aponte',1069,29,1,7),(23,'Julio Sucre',1064,19,1,7),(24,'Didimo Broce',1051,21,1,NULL),(25,'Ian Mock',1047,21,1,NULL),(26,'Makio Chang',1035,9,1,7),(27,'Sammy Mercado',1037,20,1,7),(28,'Manuel Mock',1039,21,1,NULL),(29,'Adrian Espinosa Sr.',1037,21,1,NULL),(30,'Lia Rodriguez',1036,21,1,NULL),(31,'Omar Pinilla',1036,21,1,NULL),(32,'Emmanuel Atencio',1032,21,1,NULL),(33,'Roy Mosquera',1032,29,1,NULL),(34,'Cristian Reyes',1067,21,1,7),(35,'Gustavo Polanco',1039,21,1,7),(36,'Pierre Bonilla',1027,14,1,NULL),(37,'Marco Atencio',1018,19,1,7),(38,'Theyam Matos',1024,24,1,NULL),(39,'Calvin Shi',1023,21,1,NULL),(40,'Felix Jaen',1022,19,1,7),(41,'Abraham Ramos',1047,8,1,7),(42,'Sebastian Mendoza',1021,21,1,NULL),(43,'Bolivar Armuelles',1048,14,1,7),(44,'Ernesto Bal',1020,21,1,NULL),(45,'Maycol Segundo',1019,29,1,NULL),(46,'Jose De Leon Jr.',1018,19,1,NULL),(47,'Eduardo Yee',1014,21,1,NULL),(48,'Raul Hera',1036,27,1,7),(49,'Sergio Castillo',1012,21,1,NULL),(50,'Jahir Chock',1031,21,1,7),(51,'Ivana Nieto',1002,19,2,7),(52,'Handel Lizondro',1008,21,2,NULL),(53,'Mauriel Rosero',1009,21,2,7),(54,'Eduardo Rendon',1010,19,2,NULL),(55,'Felix Barrios',951,21,2,7),(56,'Anthony Cervantes',932,29,2,7),(57,'Douglas Martinez',858,10,2,7),(58,'Moises Chanis',875,17,2,NULL),(59,'Pierre Herrmann',888,22,2,7),(60,'Randy Aranda',873,29,2,NULL),(61,'Angel Blanco',872,10,2,NULL),(62,'Edgardo Aguilar',870,21,2,7),(63,'Romulo Bethancourt',852,29,2,7),(64,'Sebastian Bethancourt',859,29,2,NULL),(65,'Eric Kojira',863,10,2,7),(66,'Juan Yau',852,7,2,NULL),(67,'Jose Carrizo',880,14,2,7),(68,'Julio Waugh',848,29,2,NULL),(69,'David Coparropa',863,21,2,7),(70,'Harold Sanchez',866,19,2,7),(71,'Joel Silvera',829,29,2,7),(72,'Daniel David',829,22,2,NULL),(73,'Delano Samuel',814,19,2,7),(74,'Mariam Solis',827,21,2,NULL),(75,'Gaspar Diaz',826,15,2,7),(76,'Arturo Murillo',832,19,2,7),(77,'Ramon Marquez',824,11,2,NULL),(78,'Elio Kushimakajo',823,22,2,NULL),(79,'Diego Sosa',822,21,2,NULL),(80,'Javier Bazan',822,19,2,NULL),(81,'Daniel Miranda',821,10,2,NULL),(82,'Joel Quiros',807,15,2,7),(83,'Felipe Huang',820,7,2,NULL),(84,'Ethan Degracia',824,29,2,7),(85,'Freddy Ruiz',819,19,2,NULL),(86,'Dorian Reyes',819,19,2,NULL),(87,'Abel Almanza',814,29,2,7),(88,'Francisco Pimentel',817,14,2,NULL),(89,'Rauly Hera',821,25,2,7),(90,'Jaime Rodriguez',816,10,2,NULL),(91,'Neftali Alcantara',813,24,2,7),(92,'Pedro Muñoz',811,29,2,7),(93,'Luis Monterrey',798,29,2,7),(94,'Alan Watt',814,28,2,NULL),(95,'Jesus Adrian Gonzalez',813,23,2,NULL),(96,'Anthuan Ortega',813,15,2,NULL),(97,'Jonathan Mock',804,21,2,7),(98,'Josue Aparicio',812,14,2,NULL),(99,'Luz Brown',812,29,2,NULL),(100,'Roberto Arauz',835,23,2,7),(101,'Johann Batista',802,21,2,7),(102,'Riogel Perez',793,19,2,7),(103,'Josue Tuñon',808,24,2,NULL),(104,'Eduardo Serracin',807,10,2,NULL),(105,'Horacio Guillen',807,29,2,NULL),(106,'Alan Palma',806,9,2,NULL),(107,'Isabella Jean Francois',806,29,2,NULL),(108,'Manuel Muñoz',799,29,2,7),(109,'Christian Prada',806,21,2,NULL),(110,'Alejandro Candanedo',840,23,2,7),(111,'Jose Acosta',803,8,2,NULL),(112,'Felix Diaz',807,8,2,7),(113,'Ariel Herrera',801,29,2,NULL),(114,'Luis Felipe Diaz',800,14,2,NULL),(115,'Erick Serrano',800,19,2,NULL),(116,'Joel Perurena',800,10,2,NULL),(117,'Oscar Chong',798,14,2,NULL),(118,'Carlos Pineda',798,19,2,NULL),(119,'Jose Hervacio',798,17,2,NULL),(120,'Jorge Serracin',810,21,2,7),(121,'Julio Castillero',802,29,2,7),(122,'Jonathan Campbell',797,11,2,NULL),(123,'Jose Alfredo',796,29,2,NULL),(124,'Joel Batista',796,11,2,NULL),(125,'Roberto Martinez',792,29,2,7),(126,'Jean Luis Mora',794,15,2,NULL),(127,'Alexis Castillo',794,10,2,NULL),(128,'Manuel Sanchez',793,13,2,NULL),(129,'Evans Bairnals',793,15,2,NULL),(130,'Rodrigo Rodriguez',791,20,2,NULL),(131,'Brandon Campos',790,29,2,NULL),(132,'Roma Luo',790,7,2,NULL),(133,'Juan Gonzalez',775,8,2,7),(134,'Ashly Rodriguez',789,20,2,NULL),(135,'Denzel Corella',787,29,2,7),(136,'Luis Wen',766,14,3,7),(137,'Antonio Deng',779,21,2,NULL),(138,'Jean Serrano',772,29,3,NULL),(139,'Abel Espino',769,29,3,7),(140,'Veronica Esquivel',767,21,3,NULL),(141,'Alberto Marquez',765,10,3,NULL),(142,'Luis Corro',748,21,3,NULL),(143,'Franky Solano',714,8,3,7),(144,'Samuel Johnson',725,29,3,7),(145,'Lukas Ochoa',695,29,3,NULL),(146,'Asaf Perigault',673,20,3,7),(147,'Luis Rodriguez',642,22,3,NULL),(148,'Roderick Pineda Jr.',635,29,3,7),(149,'Omar Gonzalez',639,10,3,NULL),(150,'Yoriel Cordoba',636,29,3,7),(151,'Manuel Terrado',670,29,3,7),(152,'Roberto Deng',634,21,3,NULL),(153,'Jackmall Rodriguez',623,19,3,7),(154,'Reinaldo Rivera',626,29,3,NULL),(155,'Carolina Lewis',622,29,3,7),(156,'Jose Ramirez',624,19,3,NULL),(157,'Elias Ortiz',621,10,3,NULL),(158,'Angel De Leon',620,18,3,NULL),(159,'Julian Evans',618,20,3,NULL),(160,'Gilberto Cedeño',614,29,3,NULL),(161,'Maikel Contreras',613,18,3,NULL),(162,'Yunior Quintero',612,10,3,NULL),(163,'Ricardo Lorenzo',611,20,3,NULL),(164,'Fiori Paiva',608,29,3,NULL),(165,'Panagiotis Stamatakis',608,22,3,NULL),(166,'Oswaldo Dall Amico',607,29,3,NULL),(167,'Ethan Montero',609,12,3,7),(168,'Jean Miller',607,15,3,NULL),(169,'Ronald Urbaez',606,29,3,NULL),(170,'Jonathan Miranda',605,15,3,NULL),(171,'Luis Berroa',603,10,3,NULL),(172,'Pablo Martinez',603,20,3,NULL),(173,'Heberto Ayarza',603,13,3,NULL),(174,'Victor Arenas',602,29,3,NULL),(175,'Juan Lopez',602,10,3,NULL),(176,'Isaldo Sanapi',602,15,3,NULL),(177,'Joel Prestan',602,15,3,NULL),(178,'Jose Castro',602,15,3,NULL),(179,'Aldair Lan',602,13,3,NULL),(180,'Alfredo Morán',601,29,3,NULL),(181,'Adrian Espinosa Jr.',594,21,3,7),(182,'Raul Pinillo',600,12,3,NULL),(183,'Jorge Valdez',600,10,3,NULL),(184,'Francisco Pimentel',600,14,3,NULL),(185,'Bryan Irigoyen',599,26,3,NULL),(186,'Jorge Silva',599,8,3,NULL),(187,'Emel Gonzalez',599,11,3,NULL),(188,'Maximo Bravo',598,18,3,NULL),(189,'Ricardo Barria',598,22,3,NULL),(190,'Eliecer Torres',598,10,3,NULL),(191,'Ameth Luna',597,10,3,NULL),(192,'Ricardo Torres',596,10,3,NULL),(193,'Jorge Pitty',583,8,3,7),(194,'José Beckford',595,12,3,NULL),(195,'Luis Campana',595,21,3,NULL),(196,'Ricardo Rodriguez',595,8,3,NULL),(197,'Jahred Fuentes',594,15,3,NULL),(198,'Xavier Gonzalez',594,15,3,NULL),(199,'Nathan De Leon',594,21,3,NULL),(200,'Tomas Hernandez',594,19,3,NULL),(201,'Yamileth Gómez',593,21,3,NULL),(202,'Luis Felipe Diaz',593,15,3,NULL),(203,'Mayerlin Caballero',593,23,3,NULL),(204,'Vicente Rodriguez',593,10,3,NULL),(205,'Fernando Moreno',592,26,3,NULL),(206,'Cristali Moreno',592,26,3,NULL),(207,'Joaquin Martinez',592,12,3,NULL),(208,'Carlos Lopez',592,15,3,NULL),(209,'Ziyu Chen',592,20,3,NULL),(210,'Julio Osorio',592,8,3,NULL),(211,'Joseph Del Cid',591,10,3,NULL),(212,'Aramis Vasquez',591,15,3,NULL),(213,'Serafin Fragueiro',590,12,3,NULL),(214,'Alexis Bultron',590,15,3,NULL),(215,'Francisco Cordoba',590,23,3,NULL),(216,'Miranda Lampe',590,29,3,NULL),(217,'Gabriel Chiari',584,10,3,7),(218,'Elian Rose',589,10,3,NULL),(219,'Roderick Pineda Sr.',584,10,3,7),(220,'Luis Anglin',588,29,3,NULL),(221,'Michael Boy',587,10,3,NULL),(222,'Ruben Vargas',587,14,3,NULL),(223,'Aimar Alvarez',586,10,3,NULL),(224,'Ariel Gomez',585,14,3,NULL),(225,'Vicente Campos',585,10,3,NULL),(226,'Jose Valencia',585,20,3,NULL),(227,'Jonathan Santti',582,16,3,7),(228,'Angelina Negrette',584,21,3,NULL),(229,'Julio Evans',584,17,3,NULL),(230,'Emma Velasquez',584,29,3,NULL),(231,'Edward Gutierrez',583,29,3,NULL),(232,'Ivan Paz',583,22,3,NULL),(233,'Jonathan Vega',581,10,3,NULL),(234,'Targino Santos',581,21,3,NULL),(235,'Lui Gutierrez',581,29,3,NULL),(236,'Thiago Baltazar',580,20,3,NULL),(237,'Carlos Diaz',580,29,3,NULL),(238,'José Adames',580,29,3,NULL),(239,'Diego Varona',579,10,3,NULL),(240,'Alejandro Chacon',573,21,3,NULL),(241,'Diego Polanco',564,21,3,7),(242,'Abel Tejada',567,8,3,7),(243,'Sarah Moscoso',571,10,3,NULL),(244,'Oscar Lorenzo',567,29,3,7),(245,'Julio Sucre Jr.',554,20,3,7),(246,'Henis Ortega',405,29,4,NULL),(247,'Manuel Chacon',395,21,4,NULL),(248,'Alan Laffaurie',419,22,4,NULL),(249,'Amanty Hera',379,25,4,7),(250,'Said Mas',390,29,4,NULL),(251,'German Mas',400,29,4,NULL),(252,'Darian Pimentel',380,8,4,NULL),(253,'Shalyn Shaikh',817,10,2,7),(254,'Jaime Velarde',590,21,3,7),(255,'Carlos Arrue',608,21,3,7),(256,'Shing Fu',595,7,3,7),(258,'Adrian Castillo',1011,30,1,7),(259,'Ian Castillo',636,30,3,7),(260,'Raul Cedeño',795,30,2,7),(261,'Marcus Morgan',797,8,2,7),(262,'Jose Morales',815,23,2,7),(263,'Jose De Leon Sr.',798,19,2,7),(264,'Flor Santos',598,19,3,7),(265,'Maria Montiel',598,8,3,7),(266,'Arianis Rodriguez',593,8,3,7),(267,'Daniel Brown',605,8,3,7),(268,'Miguel Serrano',999,21,2,7),(269,'Luis Diaz',613,10,3,7),(270,'David Ng',595,14,3,7),(271,'Luis Blanco',625,10,3,7),(272,'Francisco Grosso',590,19,3,7),(273,'Adrian Rodriguez',816,8,2,7);
/*!40000 ALTER TABLE `jugadores` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `trigger_elo_inicial` BEFORE INSERT ON `jugadores` FOR EACH ROW BEGIN
    IF NEW.elo IS NULL THEN
        SET NEW.elo = (SELECT elo_inicial FROM categorias WHERE id = NEW.categoria_id);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `participaciones`
--

DROP TABLE IF EXISTS `participaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `participaciones` (
                                   `id` int NOT NULL AUTO_INCREMENT,
                                   `jugador_id` int NOT NULL,
                                   `torneo_id` int NOT NULL,
                                   `categoria_id` int NOT NULL,
                                   `elo_antes` float NOT NULL,
                                   `elo_despues` float NOT NULL,
                                   `bonificacion` int DEFAULT '0',
                                   `ronda_alcanzada` enum('Grupos','32avos','16avos','Octavos','Cuartos','Semifinal','Final','Campeón') DEFAULT NULL,
                                   `posicion` int DEFAULT NULL,
                                   PRIMARY KEY (`id`),
                                   KEY `jugador_id` (`jugador_id`),
                                   KEY `torneo_id` (`torneo_id`),
                                   KEY `categoria_id` (`categoria_id`),
                                   CONSTRAINT `participaciones_ibfk_1` FOREIGN KEY (`jugador_id`) REFERENCES `jugadores` (`id`) ON DELETE CASCADE,
                                   CONSTRAINT `participaciones_ibfk_2` FOREIGN KEY (`torneo_id`) REFERENCES `torneos` (`id`) ON DELETE CASCADE,
                                   CONSTRAINT `participaciones_ibfk_3` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=305 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participaciones`
--

LOCK TABLES `participaciones` WRITE;
/*!40000 ALTER TABLE `participaciones` DISABLE KEYS */;
INSERT INTO `participaciones` VALUES (12,82,7,2,821,825,0,'Grupos',NULL),(13,144,7,3,720,717,0,NULL,NULL),(14,56,7,2,919,925,0,'Grupos',NULL),(15,73,7,2,828,824,0,NULL,NULL),(16,26,7,1,1041,1045,0,'Grupos',NULL),(17,82,7,2,825,822,0,NULL,NULL),(18,151,7,3,635,655,0,'Grupos',NULL),(19,82,7,2,822,807,0,NULL,NULL),(20,121,7,2,797,807,0,'Grupos',NULL),(21,73,7,2,824,814,0,NULL,NULL),(22,144,7,3,717,727,0,'Grupos',NULL),(23,102,7,2,808,798,0,NULL,NULL),(24,56,7,2,925,928,0,'Grupos',NULL),(25,151,7,3,655,653,0,NULL,NULL),(26,253,7,2,800,810,0,'Grupos',NULL),(27,97,7,2,813,803,0,NULL,NULL),(28,167,7,3,607,615,0,'Grupos',NULL),(29,254,7,3,600,595,0,NULL,NULL),(30,16,7,1,1147,1150,0,'Grupos',NULL),(31,253,7,2,810,808,0,NULL,NULL),(32,16,7,1,1150,1152,0,'Grupos',NULL),(33,148,7,3,642,641,0,NULL,NULL),(34,65,7,2,856,859,0,'Grupos',NULL),(35,254,7,3,595,593,0,NULL,NULL),(36,16,7,1,1152,1155,0,'Grupos',NULL),(37,63,7,2,864,862,0,NULL,NULL),(38,97,7,2,803,807,0,'Grupos',NULL),(39,148,7,3,641,638,0,NULL,NULL),(40,253,7,2,808,818,0,'Grupos',NULL),(41,63,7,2,862,852,0,NULL,NULL),(42,65,7,2,859,863,0,'Grupos',NULL),(43,167,7,3,615,612,0,NULL,NULL),(44,253,7,2,818,822,0,'Grupos',NULL),(45,148,7,3,638,635,0,NULL,NULL),(46,53,7,1,994,997,0,'Grupos',NULL),(47,153,7,3,630,628,0,NULL,NULL),(48,120,7,2,798,806,0,'Grupos',NULL),(49,135,7,2,788,783,0,NULL,NULL),(50,53,7,1,997,1007,0,'Grupos',NULL),(51,27,7,1,1040,1030,0,NULL,NULL),(52,255,7,3,600,610,0,'Grupos',NULL),(53,146,7,3,686,676,0,NULL,NULL),(54,53,7,1,1007,1011,0,'Grupos',NULL),(55,75,7,2,825,822,0,NULL,NULL),(56,41,7,1,1022,1026,0,'Grupos',NULL),(57,91,7,2,816,813,0,NULL,NULL),(58,143,7,3,726,730,0,'Grupos',NULL),(59,256,7,3,600,597,0,NULL,NULL),(60,27,7,1,1030,1033,0,'Grupos',NULL),(61,153,7,3,628,626,0,NULL,NULL),(62,135,7,2,783,787,0,'Grupos',NULL),(63,146,7,3,676,673,0,NULL,NULL),(64,27,7,1,1033,1037,0,'Grupos',NULL),(65,87,7,2,817,814,0,NULL,NULL),(66,75,7,2,822,826,0,'Grupos',NULL),(67,153,7,3,626,623,0,NULL,NULL),(68,258,7,1,1000,1003,0,'Grupos',NULL),(69,256,7,3,597,595,0,NULL,NULL),(70,259,7,3,600,620,0,'Grupos',NULL),(71,136,7,2,781,766,0,NULL,NULL),(72,41,7,1,1026,1034,0,'Grupos',NULL),(73,258,7,1,1003,998,0,NULL,NULL),(74,259,7,3,620,640,0,'Grupos',NULL),(75,143,7,3,730,715,0,NULL,NULL),(76,258,7,1,998,1002,0,'Grupos',NULL),(77,261,7,2,800,797,0,NULL,NULL),(78,260,7,2,800,797,0,'Grupos',NULL),(79,41,7,1,1034,1040,0,NULL,NULL),(80,110,7,2,805,825,0,'Grupos',NULL),(81,55,7,1,991,976,0,NULL,NULL),(82,100,7,2,808,812,0,'Grupos',NULL),(83,217,7,3,589,586,0,NULL,NULL),(84,262,7,2,800,820,0,'Grupos',NULL),(85,55,7,1,976,961,0,NULL,NULL),(86,59,7,2,875,885,0,'Grupos',NULL),(87,55,7,1,961,951,0,NULL,NULL),(88,20,7,1,1080,1083,0,'Grupos',NULL),(89,217,7,3,586,584,0,NULL,NULL),(90,20,7,1,1083,1086,0,'Grupos',NULL),(91,110,7,2,825,823,0,NULL,NULL),(92,59,7,2,885,891,0,'Grupos',NULL),(93,100,7,2,812,808,0,NULL,NULL),(94,48,7,1,1013,1023,0,'Grupos',NULL),(95,22,7,1,1067,1057,0,NULL,NULL),(96,71,7,2,836,839,0,'Grupos',NULL),(97,249,7,4,382,380,0,NULL,NULL),(98,48,7,1,1023,1026,0,'Grupos',NULL),(99,155,7,3,626,624,0,NULL,NULL),(100,22,7,1,1057,1061,0,'Grupos',NULL),(101,89,7,2,816,813,0,NULL,NULL),(102,37,7,1,1025,1027,0,'Grupos',NULL),(103,249,7,4,380,379,0,NULL,NULL),(104,89,7,2,813,821,0,'Grupos',NULL),(105,263,7,2,800,795,0,NULL,NULL),(106,48,7,1,1026,1036,0,'Grupos',NULL),(107,37,7,1,1027,1017,0,NULL,NULL),(108,22,7,1,1061,1069,0,'Grupos',NULL),(109,37,7,1,1017,1012,0,NULL,NULL),(110,263,7,2,795,805,0,'Grupos',NULL),(111,71,7,2,839,829,0,NULL,NULL),(112,37,7,1,1012,1015,0,'Grupos',NULL),(113,155,7,3,624,622,0,NULL,NULL),(114,35,7,1,1029,1032,0,'Grupos',NULL),(115,265,7,3,600,598,0,NULL,NULL),(116,69,7,2,846,854,0,'Grupos',NULL),(117,112,7,2,802,797,0,NULL,NULL),(118,35,7,1,1032,1036,0,'Grupos',NULL),(119,101,7,2,808,805,0,NULL,NULL),(120,34,7,1,1030,1033,0,'Grupos',NULL),(121,266,7,3,600,598,0,NULL,NULL),(122,112,7,2,797,807,0,'Grupos',NULL),(123,57,7,2,877,867,0,NULL,NULL),(124,34,7,1,1033,1037,0,'Grupos',NULL),(125,101,7,2,805,802,0,NULL,NULL),(126,267,7,3,600,608,0,'Grupos',NULL),(127,266,7,3,598,593,0,NULL,NULL),(128,34,7,1,1037,1045,0,'Grupos',NULL),(129,268,7,1,1000,995,0,NULL,NULL),(130,69,7,2,854,858,0,'Grupos',NULL),(131,267,7,3,608,605,0,NULL,NULL),(132,268,7,1,995,999,0,'Grupos',NULL),(133,57,7,2,867,864,0,NULL,NULL),(134,34,7,1,1045,1048,0,'Grupos',NULL),(135,241,7,3,573,571,0,NULL,NULL),(136,40,7,1,1023,1023,0,'Grupos',NULL),(137,269,7,3,600,608,0,'Grupos',NULL),(138,181,7,3,600,595,0,NULL,NULL),(139,40,7,1,1023,1027,0,'Grupos',NULL),(140,108,7,2,806,803,0,NULL,NULL),(141,269,7,3,608,616,0,'Grupos',NULL),(142,219,7,3,589,584,0,NULL,NULL),(143,62,7,2,867,873,0,'Grupos',NULL),(144,108,7,2,803,799,0,NULL,NULL),(145,50,7,1,1011,1015,0,'Grupos',NULL),(146,125,7,2,795,792,0,NULL,NULL),(147,43,7,1,1020,1023,0,'Grupos',NULL),(148,245,7,3,564,562,0,NULL,NULL),(149,67,7,2,849,857,0,'Grupos',NULL),(150,76,7,2,824,819,0,NULL,NULL),(151,43,7,1,1023,1033,0,'Grupos',NULL),(152,23,7,1,1064,1054,0,NULL,NULL),(153,67,7,2,857,865,0,'Grupos',NULL),(154,92,7,2,815,810,0,NULL,NULL),(155,67,7,2,865,868,0,'Grupos',NULL),(156,244,7,3,569,567,0,NULL,NULL),(157,139,7,2,770,774,0,'Grupos',NULL),(158,270,7,3,600,597,0,NULL,NULL),(159,92,7,2,810,814,0,'Grupos',NULL),(160,245,7,3,562,559,0,NULL,NULL),(161,76,7,2,819,827,0,'Grupos',NULL),(162,139,7,2,774,769,0,NULL,NULL),(163,23,7,1,1054,1058,0,'Grupos',NULL),(164,92,7,2,814,811,0,NULL,NULL),(165,70,7,2,839,842,0,'Grupos',NULL),(166,242,7,3,571,569,0,NULL,NULL),(167,271,7,3,600,620,0,'Grupos',NULL),(168,133,7,2,789,774,0,NULL,NULL),(169,273,7,2,800,804,0,'Grupos',NULL),(170,272,7,3,600,597,0,NULL,NULL),(171,271,7,3,620,628,0,'Grupos',NULL),(172,193,7,3,596,591,0,NULL,NULL),(173,21,7,1,1070,1073,0,'Grupos',NULL),(174,272,7,3,597,595,0,NULL,NULL),(175,273,7,2,804,808,0,'Grupos',NULL),(176,150,7,3,639,636,0,NULL,NULL),(177,51,7,1,1009,1012,0,'Grupos',NULL),(178,193,7,3,591,589,0,NULL,NULL),(179,273,7,2,808,818,0,'Grupos',NULL),(180,84,7,2,820,810,0,NULL,NULL),(181,21,7,1,1073,1076,0,'Grupos',NULL),(182,150,7,3,636,634,0,NULL,NULL),(183,51,7,1,1012,1015,0,'Grupos',NULL),(184,242,7,3,569,567,0,NULL,NULL),(185,84,7,2,810,820,0,'Grupos',NULL),(186,93,7,2,815,805,0,NULL,NULL),(187,51,7,1,1015,1019,0,'Grupos',NULL),(188,133,7,2,774,771,0,NULL,NULL),(189,70,7,2,842,846,0,'Grupos',NULL),(190,150,7,3,634,631,0,NULL,NULL),(191,70,7,2,846,866,0,'Grupos',NULL),(192,51,7,1,1019,1004,0,NULL,NULL),(193,150,7,3,631,639,0,'Grupos',NULL),(194,272,7,3,595,590,0,NULL,NULL),(195,21,7,1,1076,1079,0,'Grupos',NULL),(196,93,7,2,805,803,0,NULL,NULL),(197,133,7,2,771,775,0,'Grupos',NULL),(198,193,7,3,589,586,0,NULL,NULL),(199,273,7,2,818,826,0,'Grupos',NULL),(200,93,7,2,803,798,0,NULL,NULL),(201,23,7,1,1058,1061,0,'Grupos',NULL),(202,263,7,2,805,803,0,NULL,NULL),(203,37,7,1,1015,1018,0,'Grupos',NULL),(204,245,7,3,559,557,0,NULL,NULL),(205,23,7,1,1061,1064,0,'Grupos',NULL),(206,264,7,3,600,598,0,NULL,NULL),(207,76,7,2,827,835,0,'Grupos',NULL),(208,263,7,2,803,798,0,NULL,NULL),(209,16,7,1,1155,1159,0,'Grupos',NULL),(210,258,7,1,1002,999,0,NULL,NULL),(211,260,7,2,797,801,0,'Grupos',NULL),(212,254,7,3,593,590,0,NULL,NULL),(213,16,7,1,1159,1161,0,'Grupos',NULL),(214,259,7,3,640,639,0,NULL,NULL),(215,258,7,1,999,1003,0,'Grupos',NULL),(216,97,7,2,807,804,0,NULL,NULL),(217,110,7,2,823,827,0,'Grupos',NULL),(218,151,7,3,653,650,0,NULL,NULL),(219,100,7,2,808,816,0,'Grupos',NULL),(220,102,7,2,798,793,0,NULL,NULL),(221,151,7,3,650,670,0,'Grupos',NULL),(222,262,7,2,820,805,0,NULL,NULL),(223,110,7,2,827,835,0,'Grupos',NULL),(224,121,7,2,807,802,0,NULL,NULL),(225,51,7,1,1004,1007,0,'Grupos',NULL),(226,181,7,3,595,593,0,NULL,NULL),(227,62,7,2,873,877,0,'Grupos',NULL),(228,150,7,3,639,636,0,NULL,NULL),(229,50,7,1,1015,1023,0,'Grupos',NULL),(230,51,7,1,1007,1002,0,NULL,NULL),(231,110,7,2,835,843,0,'Grupos',NULL),(232,253,7,2,822,817,0,NULL,NULL),(233,100,7,2,816,820,0,'Grupos',NULL),(234,167,7,3,612,609,0,NULL,NULL),(235,34,7,1,1048,1056,0,'Grupos',NULL),(236,40,7,1,1027,1022,0,NULL,NULL),(237,57,7,2,864,868,0,'Grupos',NULL),(238,269,7,3,616,613,0,NULL,NULL),(239,258,7,1,1003,1006,0,'Grupos',NULL),(240,144,7,3,727,725,0,NULL,NULL),(241,56,7,2,928,932,0,'Grupos',NULL),(242,260,7,2,801,798,0,NULL,NULL),(243,258,7,1,1006,1016,0,'Grupos',NULL),(244,26,7,1,1045,1035,0,NULL,NULL),(245,53,7,1,1011,1014,0,'Grupos',NULL),(246,181,7,3,593,591,0,NULL,NULL),(247,62,7,2,877,880,0,'Grupos',NULL),(248,255,7,3,610,608,0,NULL,NULL),(249,120,7,2,806,810,0,'Grupos',NULL),(250,181,7,3,591,588,0,NULL,NULL),(251,50,7,1,1023,1031,0,'Grupos',NULL),(252,53,7,1,1014,1009,0,NULL,NULL),(253,20,7,1,1086,1092,0,'Grupos',NULL),(254,43,7,1,1033,1029,0,NULL,NULL),(255,67,7,2,868,871,0,'Grupos',NULL),(256,227,7,3,584,582,0,NULL,NULL),(257,20,7,1,1092,1095,0,'Grupos',NULL),(258,270,7,3,597,595,0,NULL,NULL),(259,43,7,1,1029,1033,0,'Grupos',NULL),(260,59,7,2,891,888,0,NULL,NULL),(261,41,7,1,1040,1044,0,'Grupos',NULL),(262,76,7,2,835,832,0,NULL,NULL),(263,143,7,3,715,719,0,'Grupos',NULL),(264,245,7,3,557,554,0,NULL,NULL),(265,100,7,2,820,830,0,'Grupos',NULL),(266,273,7,2,826,816,0,NULL,NULL),(267,21,7,1,1079,1083,0,'Grupos',NULL),(268,67,7,2,871,868,0,NULL,NULL),(269,100,7,2,830,834,0,'Grupos',NULL),(270,193,7,3,586,583,0,NULL,NULL),(271,34,7,1,1056,1064,0,'Grupos',NULL),(272,41,7,1,1044,1039,0,NULL,NULL),(273,261,7,2,797,807,0,'Grupos',NULL),(274,57,7,2,868,858,0,NULL,NULL),(275,34,7,1,1064,1067,0,'Grupos',NULL),(276,143,7,3,719,717,0,NULL,NULL),(277,181,7,3,588,596,0,'Grupos',NULL),(278,241,7,3,571,566,0,NULL,NULL),(279,69,7,2,858,868,0,'Grupos',NULL),(280,62,7,2,880,870,0,NULL,NULL),(281,35,7,1,1036,1039,0,'Grupos',NULL),(282,181,7,3,596,594,0,NULL,NULL),(283,43,7,1,1033,1041,0,'Grupos',NULL),(284,258,7,1,1016,1011,0,NULL,NULL),(285,67,7,2,868,872,0,'Grupos',NULL),(286,259,7,3,639,636,0,NULL,NULL),(287,43,7,1,1041,1045,0,'Grupos',NULL),(288,260,7,2,798,795,0,NULL,NULL),(289,41,7,1,1039,1043,0,'Grupos',NULL),(290,100,7,2,834,831,0,NULL,NULL),(291,262,7,2,805,815,0,'Grupos',NULL),(292,261,7,2,807,797,0,NULL,NULL),(293,41,7,1,1043,1047,0,'Grupos',NULL),(294,110,7,2,843,840,0,NULL,NULL),(295,100,7,2,831,835,0,'Grupos',NULL),(296,143,7,3,717,714,0,NULL,NULL),(297,43,7,1,1045,1048,0,'Grupos',NULL),(298,241,7,3,566,564,0,NULL,NULL),(299,67,7,2,872,880,0,'Grupos',NULL),(300,69,7,2,868,863,0,NULL,NULL),(301,84,7,2,820,824,0,'Grupos',NULL),(302,271,7,3,628,625,0,NULL,NULL);
/*!40000 ALTER TABLE `participaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidos`
--

DROP TABLE IF EXISTS `partidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos` (
                            `id` int NOT NULL AUTO_INCREMENT,
                            `jugador1_id` int NOT NULL,
                            `jugador2_id` int DEFAULT NULL,
                            `ganador_id` int NOT NULL,
                            `torneo_id` int NOT NULL,
                            `ronda` enum('Grupos','32avos','16avos','Octavos','Cuartos','semifinal','final','Campeón') DEFAULT NULL,
                            `tipo_especial` enum('Forfeit','Bye') DEFAULT NULL,
                            `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
                            PRIMARY KEY (`id`),
                            KEY `jugador1_id` (`jugador1_id`),
                            KEY `jugador2_id` (`jugador2_id`),
                            KEY `ganador_id` (`ganador_id`),
                            KEY `torneo_id` (`torneo_id`),
                            CONSTRAINT `partidos_ibfk_1` FOREIGN KEY (`jugador1_id`) REFERENCES `jugadores` (`id`) ON DELETE CASCADE,
                            CONSTRAINT `partidos_ibfk_2` FOREIGN KEY (`jugador2_id`) REFERENCES `jugadores` (`id`) ON DELETE CASCADE,
                            CONSTRAINT `partidos_ibfk_3` FOREIGN KEY (`ganador_id`) REFERENCES `jugadores` (`id`) ON DELETE CASCADE,
                            CONSTRAINT `partidos_ibfk_4` FOREIGN KEY (`torneo_id`) REFERENCES `torneos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=148 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos`
--

LOCK TABLES `partidos` WRITE;
/*!40000 ALTER TABLE `partidos` DISABLE KEYS */;
INSERT INTO `partidos` VALUES (1,82,144,82,7,'Grupos',NULL,'2025-06-09 12:06:59'),(2,73,56,56,7,'Grupos',NULL,'2025-06-16 03:13:27'),(3,82,26,26,7,'Grupos',NULL,'2025-06-16 03:14:02'),(4,151,82,151,7,'Grupos',NULL,'2025-06-16 03:14:46'),(5,121,73,121,7,'Grupos',NULL,'2025-06-16 03:15:19'),(6,144,102,144,7,'Grupos',NULL,'2025-06-16 03:16:16'),(7,56,151,56,7,'Grupos',NULL,'2025-06-16 03:16:47'),(8,253,97,253,7,'Grupos',NULL,'2025-06-16 03:21:17'),(9,167,254,167,7,'Grupos',NULL,'2025-06-16 03:23:19'),(10,16,253,16,7,'Grupos',NULL,'2025-06-16 03:23:57'),(11,16,148,16,7,'Grupos',NULL,'2025-06-16 03:24:32'),(12,65,254,65,7,'Grupos',NULL,'2025-06-16 03:25:12'),(13,16,63,16,7,'Grupos',NULL,'2025-06-16 03:26:30'),(14,97,148,97,7,'Grupos',NULL,'2025-06-16 03:27:05'),(15,253,63,253,7,'Grupos',NULL,'2025-06-16 03:28:18'),(16,65,167,65,7,'Grupos',NULL,'2025-06-16 03:28:47'),(17,253,148,253,7,'Grupos',NULL,'2025-06-16 03:30:09'),(18,53,153,53,7,'Grupos',NULL,'2025-06-16 03:30:38'),(19,120,135,120,7,'Grupos',NULL,'2025-06-16 03:31:22'),(20,53,27,53,7,'Grupos',NULL,'2025-06-16 03:31:49'),(21,255,146,255,7,'Grupos',NULL,'2025-06-16 03:32:59'),(22,53,75,53,7,'Grupos',NULL,'2025-06-16 03:34:16'),(23,41,91,41,7,'Grupos',NULL,'2025-06-16 03:35:09'),(24,143,256,143,7,'Grupos',NULL,'2025-06-16 03:36:07'),(25,27,153,27,7,'Grupos',NULL,'2025-06-16 03:37:05'),(26,135,146,135,7,'Grupos',NULL,'2025-06-16 03:37:31'),(27,27,87,27,7,'Grupos',NULL,'2025-06-16 03:37:54'),(28,75,153,75,7,'Grupos',NULL,'2025-06-16 03:38:24'),(29,258,256,258,7,'Grupos',NULL,'2025-06-16 03:42:59'),(30,259,136,259,7,'Grupos',NULL,'2025-06-16 03:43:57'),(31,41,258,41,7,'Grupos',NULL,'2025-06-16 03:49:18'),(32,259,143,259,7,'Grupos',NULL,'2025-06-16 03:50:05'),(33,258,261,258,7,'Grupos',NULL,'2025-06-16 03:51:33'),(34,260,41,41,7,'Grupos',NULL,'2025-06-15 22:52:18'),(35,110,55,110,7,'Grupos',NULL,'2025-06-16 04:03:06'),(36,100,217,100,7,'Grupos',NULL,'2025-06-16 04:03:57'),(37,262,55,262,7,'Grupos',NULL,'2025-06-16 04:08:24'),(38,59,55,59,7,'Grupos',NULL,'2025-06-16 04:09:11'),(39,20,217,20,7,'Grupos',NULL,'2025-06-16 04:09:37'),(40,20,110,20,7,'Grupos',NULL,'2025-06-16 04:10:47'),(41,59,100,59,7,'Grupos',NULL,'2025-06-16 04:11:24'),(42,48,22,48,7,'Grupos',NULL,'2025-06-16 04:12:18'),(43,71,249,71,7,'Grupos',NULL,'2025-06-16 04:12:41'),(44,48,155,48,7,'Grupos',NULL,'2025-06-16 04:13:06'),(45,22,89,22,7,'Grupos',NULL,'2025-06-16 04:13:34'),(46,37,249,37,7,'Grupos',NULL,'2025-06-16 04:16:11'),(47,89,263,89,7,'Grupos',NULL,'2025-06-16 04:16:48'),(48,48,37,48,7,'Grupos',NULL,'2025-06-16 04:17:13'),(49,22,37,22,7,'Grupos',NULL,'2025-06-16 04:18:23'),(50,263,71,263,7,'Grupos',NULL,'2025-06-16 04:18:49'),(51,37,155,37,7,'Grupos',NULL,'2025-06-16 04:19:35'),(52,35,265,35,7,'Grupos',NULL,'2025-06-16 04:21:57'),(53,69,112,69,7,'Grupos',NULL,'2025-06-16 04:22:41'),(54,35,101,35,7,'Grupos',NULL,'2025-06-16 04:23:07'),(55,34,266,34,7,'Grupos',NULL,'2025-06-23 04:26:37'),(56,57,112,112,7,'Grupos',NULL,'2025-06-23 04:27:39'),(57,34,101,34,7,'Grupos',NULL,'2025-06-23 04:28:03'),(58,267,266,267,7,'Grupos',NULL,'2025-06-23 04:28:52'),(59,34,268,34,7,'Grupos',NULL,'2025-06-23 04:30:08'),(60,69,267,69,7,'Grupos',NULL,'2025-06-23 04:30:33'),(61,268,57,268,7,'Grupos',NULL,'2025-06-23 04:31:11'),(62,34,241,34,7,'Grupos',NULL,'2025-06-23 04:31:33'),(63,40,NULL,40,7,'Grupos',NULL,'2025-06-23 04:33:00'),(64,269,181,269,7,'Grupos',NULL,'2025-06-23 04:35:24'),(65,40,108,40,7,'Grupos',NULL,'2025-06-23 04:36:16'),(66,269,219,269,7,'Grupos',NULL,'2025-06-23 04:37:10'),(67,62,108,62,7,'Grupos',NULL,'2025-06-23 04:37:45'),(68,50,125,50,7,'Grupos',NULL,'2025-06-23 04:38:07'),(69,43,245,43,7,'Grupos',NULL,'2025-06-23 04:38:51'),(70,67,76,67,7,'Grupos',NULL,'2025-06-23 04:39:47'),(71,43,23,43,7,'Grupos',NULL,'2025-06-23 04:40:20'),(72,67,92,67,7,'Grupos',NULL,'2025-06-23 04:41:22'),(73,67,244,67,7,'Grupos',NULL,'2025-06-23 04:43:41'),(74,139,270,139,7,'Grupos',NULL,'2025-06-23 04:44:18'),(75,92,245,92,7,'Grupos',NULL,'2025-06-23 04:44:55'),(76,76,139,76,7,'Grupos',NULL,'2025-06-23 04:45:15'),(77,23,92,23,7,'Grupos',NULL,'2025-06-23 04:45:38'),(78,70,242,70,7,'Grupos',NULL,'2025-06-23 04:47:00'),(79,271,133,271,7,'Grupos',NULL,'2025-06-23 04:48:42'),(80,273,272,273,7,'Grupos',NULL,'2025-06-23 04:51:26'),(81,271,193,271,7,'Grupos',NULL,'2025-06-23 04:51:51'),(82,21,272,21,7,'Grupos',NULL,'2025-06-23 04:52:23'),(83,273,150,273,7,'Grupos',NULL,'2025-06-23 04:52:58'),(84,51,193,51,7,'Grupos',NULL,'2025-06-23 04:53:32'),(85,273,84,273,7,'Grupos',NULL,'2025-06-23 04:53:54'),(86,21,150,21,7,'Grupos',NULL,'2025-06-23 04:54:23'),(87,51,242,51,7,'Grupos',NULL,'2025-06-23 04:54:49'),(88,84,93,84,7,'Grupos',NULL,'2025-06-23 04:55:14'),(89,51,133,51,7,'Grupos',NULL,'2025-06-23 04:55:41'),(90,70,150,70,7,'Grupos',NULL,'2025-06-23 04:56:54'),(91,70,51,70,7,'Grupos',NULL,'2025-06-23 05:01:43'),(92,150,272,150,7,'Grupos',NULL,'2025-06-23 05:02:13'),(93,21,93,21,7,'Grupos',NULL,'2025-06-23 05:03:13'),(94,133,193,133,7,'Grupos',NULL,'2025-06-23 05:03:46'),(95,273,93,273,7,'Grupos',NULL,'2025-06-23 05:04:45'),(96,23,263,23,7,'Grupos',NULL,'2025-06-23 05:05:22'),(97,37,245,37,7,'Grupos',NULL,'2025-06-23 05:06:02'),(98,23,264,23,7,'Grupos',NULL,'2025-06-23 05:06:44'),(99,76,263,76,7,'Grupos',NULL,'2025-06-23 05:07:26'),(100,16,258,16,7,'Grupos',NULL,'2025-06-23 05:07:52'),(101,260,254,260,7,'Grupos',NULL,'2025-06-23 05:09:21'),(102,16,259,16,7,'Grupos',NULL,'2025-06-23 05:09:48'),(103,258,97,258,7,'Grupos',NULL,'2025-06-23 05:10:10'),(104,110,151,110,7,'Grupos',NULL,'2025-06-23 05:10:43'),(105,100,102,100,7,'Grupos',NULL,'2025-06-23 05:11:02'),(106,151,262,151,7,'Grupos',NULL,'2025-06-23 05:12:05'),(107,110,121,110,7,'Grupos',NULL,'2025-06-23 05:12:27'),(108,51,181,51,7,'Grupos',NULL,'2025-06-23 05:12:57'),(109,62,150,62,7,'Grupos',NULL,'2025-06-23 05:13:18'),(110,50,51,50,7,'Grupos',NULL,'2025-06-23 05:13:36'),(111,110,253,110,7,'Grupos',NULL,'2025-06-23 05:14:34'),(112,100,167,100,7,'Grupos',NULL,'2025-06-23 05:14:57'),(113,40,34,34,7,'Grupos',NULL,'2025-06-23 05:15:35'),(114,57,269,57,7,'Grupos',NULL,'2025-06-23 05:15:58'),(115,258,144,258,7,'Grupos',NULL,'2025-06-23 05:16:39'),(116,56,260,56,7,'Grupos',NULL,'2025-06-23 05:17:13'),(117,258,26,258,7,'Grupos',NULL,'2025-06-23 05:17:27'),(118,53,181,53,7,'Grupos',NULL,'2025-06-23 05:20:58'),(119,62,255,62,7,'Grupos',NULL,'2025-06-23 05:21:24'),(120,120,181,120,7,'Grupos',NULL,'2025-06-23 05:21:56'),(121,50,53,50,7,'Grupos',NULL,'2025-06-23 05:22:25'),(122,20,43,20,7,'Grupos',NULL,'2025-06-23 05:23:44'),(123,67,227,67,7,'Grupos',NULL,'2025-06-23 05:24:09'),(124,20,270,20,7,'Grupos',NULL,'2025-06-23 05:24:34'),(125,43,59,43,7,'Grupos',NULL,'2025-06-23 05:25:09'),(126,41,76,41,7,'Grupos',NULL,'2025-06-23 05:30:45'),(127,143,245,143,7,'Grupos',NULL,'2025-06-23 05:31:19'),(128,100,273,100,7,'Grupos',NULL,'2025-06-23 05:32:19'),(129,21,67,21,7,'Grupos',NULL,'2025-06-23 05:32:43'),(130,100,193,100,7,'Grupos',NULL,'2025-06-23 05:33:17'),(131,34,41,34,7,'Grupos',NULL,'2025-06-23 05:33:58'),(132,261,57,261,7,'Grupos',NULL,'2025-06-23 05:34:21'),(133,34,143,34,7,'Grupos',NULL,'2025-06-23 05:34:45'),(134,181,241,181,7,'Grupos',NULL,'2025-06-23 05:35:08'),(135,69,62,69,7,'Grupos',NULL,'2025-06-23 05:35:30'),(136,35,181,35,7,'Grupos',NULL,'2025-06-23 05:35:50'),(137,43,258,43,7,'Grupos',NULL,'2025-06-23 05:36:16'),(138,67,259,67,7,'Grupos',NULL,'2025-06-23 05:36:37'),(139,43,260,43,7,'Grupos',NULL,'2025-06-23 05:37:00'),(140,41,100,41,7,'Grupos',NULL,'2025-06-23 05:37:32'),(141,262,261,262,7,'Grupos',NULL,'2025-06-23 05:38:13'),(142,41,110,41,7,'Grupos',NULL,'2025-06-23 05:38:46'),(143,100,143,100,7,'Grupos',NULL,'2025-06-23 05:39:21'),(144,43,241,43,7,'Grupos',NULL,'2025-06-23 05:39:50'),(145,67,69,67,7,'Grupos',NULL,'2025-06-23 05:40:16'),(146,84,271,84,7,'Grupos',NULL,'2025-06-25 02:30:20');
/*!40000 ALTER TABLE `partidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `torneo_categorias`
--

DROP TABLE IF EXISTS `torneo_categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `torneo_categorias` (
                                     `torneo_id` int NOT NULL,
                                     `categoria_id` int NOT NULL,
                                     PRIMARY KEY (`torneo_id`,`categoria_id`),
                                     KEY `categoria_id` (`categoria_id`),
                                     CONSTRAINT `torneo_categorias_ibfk_1` FOREIGN KEY (`torneo_id`) REFERENCES `torneos` (`id`) ON DELETE CASCADE,
                                     CONSTRAINT `torneo_categorias_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `torneo_categorias`
--

LOCK TABLES `torneo_categorias` WRITE;
/*!40000 ALTER TABLE `torneo_categorias` DISABLE KEYS */;
INSERT INTO `torneo_categorias` VALUES (7,1),(7,2),(7,3),(7,4);
/*!40000 ALTER TABLE `torneo_categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `torneos`
--

DROP TABLE IF EXISTS `torneos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `torneos` (
                           `id` int NOT NULL AUTO_INCREMENT,
                           `nombre` varchar(100) NOT NULL,
                           `fecha` date NOT NULL,
                           `ubicacion` varchar(100) DEFAULT NULL,
                           PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `torneos`
--

LOCK TABLES `torneos` WRITE;
/*!40000 ALTER TABLE `torneos` DISABLE KEYS */;
INSERT INTO `torneos` VALUES (7,'Atta Teams','2025-05-16','Complejo Roberto Kelly');
/*!40000 ALTER TABLE `torneos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-07 16:39:00

