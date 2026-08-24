# CorridaX Beta 1.0.0 — Registro Técnico de Evidência

**Projeto:** CorridaX  
**Versão:** 1.0.0 Beta  
**Data do registro:** 24/08/2026  
**Package Android:** `com.corridax.app`  
**Repositório:** `https://github.com/wilkersferreira-cell/CorridaX.git`  
**Tag Git:** `v1.0.0-beta`

---

## 1. Finalidade deste documento

Este arquivo registra tecnicamente a versão **CorridaX Beta 1.0.0** que foi preparada, assinada, validada em dispositivo físico e distribuída de forma controlada para testadores em 24/08/2026.

O objetivo é manter uma trilha documental verificável da evolução do projeto, relacionando:

- versão do software;
- estado versionado do código;
- tag Git correspondente;
- identificação do pacote Android;
- hash criptográfico do APK distribuído;
- certificado utilizado na assinatura;
- validações realizadas;
- distribuição inicial da versão Beta.

Este documento constitui um **registro técnico de evidência** e não substitui registro de programa de computador no INPI, registro de marca, contrato, termo de cessão ou qualquer outro instrumento jurídico formal.

---

## 2. Identificação da versão

- **Nome:** CorridaX
- **Versão:** 1.0.0
- **Canal:** Beta controlado
- **Package Android:** `com.corridax.app`
- **Version Code:** `1`
- **Version Name:** `1.0.0`
- **Tag Git:** `v1.0.0-beta`

A tag anotada foi criada com a descrição:

> CorridaX Beta 1.0.0 - primeira versão distribuída para testadores

A tag foi enviada ao repositório remoto `origin`.

---

## 3. APK Beta distribuído

Arquivo utilizado:

`D:\CorridaX\android\app\build\outputs\apk\release\app-release.apk`

### SHA-256 do APK

`769520981F510F81CCA22F2307BC34D9867E3440AC690B65C649862FC1F5E2CC`

Este SHA-256 identifica exatamente o arquivo binário da Beta 1.0.0 utilizado na distribuição controlada.

Qualquer alteração no conteúdo do APK produzirá um hash diferente.

---

## 4. Assinatura digital do APK

O APK foi assinado com a chave de upload oficial do projeto CorridaX.

**Alias:** `corridax-upload`

**Titular do certificado:**

`CN=Wilker de Souza Ferreira, OU=CorridaX, O=CorridaX, L=Manaus, ST=Amazonas, C=BR`

### Fingerprint SHA-1 do certificado

`ED:77:CD:58:EB:15:D7:06:92:CA:A5:D2:03:8A:FB:BD:D1:E6:D6:43`

### Fingerprint SHA-256 do certificado

`09:92:D8:20:68:B7:0F:80:1C:7A:48:47:BC:8D:1B:85:EE:76:3D:ED:B6:18:31:09:14:81:1C:C4:83:8A:48:16`

### Validade do certificado

De 24/08/2026 até 09/01/2054.

---

## 5. Validação da assinatura

O APK foi verificado com `apksigner`.

Resultado registrado:

- `Verifies`
- APK Signature Scheme v2: `true`
- Número de signatários: `1`
- Algoritmo da chave: RSA
- Tamanho da chave: 2048 bits

O certificado apresentado pelo APK corresponde ao certificado oficial `corridax-upload`.

O AAB Release correspondente também foi verificado com `jarsigner`, retornando:

`ExitCode = 0`

---

## 6. Build Release

### Android App Bundle

O AAB Release foi gerado com sucesso:

`D:\CorridaX\android\app\build\outputs\bundle\release\app-release.aab`

Resultado:

`BUILD SUCCESSFUL`

### APK Release

O APK Release Beta foi gerado com sucesso:

`D:\CorridaX\android\app\build\outputs\apk\release\app-release.apk`

Resultado:

`BUILD SUCCESSFUL`

---

## 7. Firebase e Google Sign-In

O app Android está registrado no Firebase com:

`com.corridax.app`

O novo `google-services.json` foi atualizado após o cadastro dos fingerprints da chave de upload.

O arquivo passou a conter três clientes OAuth, incluindo o cliente Android correspondente ao SHA-1:

`ed77cd58eb15d70692caa5d2038afbbdd1e6d643`

Os arquivos:

- `D:\CorridaX\google-services.json`
- `D:\CorridaX\android\app\google-services.json`

foram sincronizados e apresentaram o mesmo SHA-256:

`77452F10DA8CCCAAEF1CC3B635FF83263AC520F84CBE494CD27032029BB60D16`

---

## 8. Teste em dispositivo físico

A Beta 1.0.0 foi instalada no dispositivo físico:

**Samsung Galaxy S21+ — SM-G996B**

A versão anterior foi removida e o APK Release assinado foi instalado via ADB.

Resultado da instalação:

`Success`

O aplicativo foi então executado diretamente pelo ícone do Android, sem depender de Metro, VS Code ou computador.

Foram validados com sucesso:

- login por e-mail/senha;
- Google Sign-In;
- sessão persistente;
- localização GPS;
- exibição do endereço real da origem;
- pesquisa de destino;
- cálculo de rota;
- distância e tempo estimados;
- modalidades carro, moto, bicicleta e a pé;
- comparação de corridas;
- motor próprio de estimativa de preços;
- abertura da Uber;
- abertura da 99;
- abertura do inDrive;
- início de rota pelo Google Maps;
- Favoritos;
- Favoritos → Home;
- Histórico;
- persistência do Histórico após fechar e reabrir o aplicativo.

---

## 9. Histórico persistente

A Beta 1.0.0 contém persistência do Histórico por usuário.

Exemplo registrado durante a validação:

- **Origem:** Avenida Rio Negro, Mauazinho
- **Destino:** Praia da Ponta Negra
- **Distância:** 25,368 km
- **Duração estimada:** aproximadamente 41,12 min
- **Modalidade:** carro
- **Modo de comparação:** balanced

O registro permaneceu armazenado após o fechamento e reabertura do aplicativo.

---

## 10. Distribuição Beta

Em 24/08/2026, o APK Beta 1.0.0 foi enviado ao **Firebase App Distribution** para distribuição controlada.

Distribuição inicial registrada:

- Versão: `1.0.0 (1)`
- Testadores convidados: `2`
- Canal: Firebase App Distribution

A distribuição foi destinada exclusivamente a testes de pré-lançamento.

---

## 11. Git e versionamento

A tag utilizada para marcar o estado versionado do projeto foi:

`v1.0.0-beta`

Comando utilizado:

```bash
git tag -a v1.0.0-beta -m "CorridaX Beta 1.0.0 - primeira versão distribuída para testadores"
```

Envio ao repositório remoto:

```bash
git push origin v1.0.0-beta
```

Resultado:

`[new tag] v1.0.0-beta -> v1.0.0-beta`

---

## 12. Observação sobre arquivos não versionados

No estado atual do projeto, o `.gitignore` exclui:

- `/android`
- `google-services.json`

Portanto, configurações nativas Android e o arquivo Firebase não estão armazenados diretamente no repositório Git.

Por esse motivo, o SHA-256 do APK descrito neste documento é especialmente importante para identificar de forma inequívoca o binário exato distribuído como **CorridaX Beta 1.0.0**.

---

## 13. Preservação recomendada

Devem ser preservados em local seguro:

1. repositório Git e tag `v1.0.0-beta`;
2. APK Beta 1.0.0;
3. SHA-256 do APK;
4. chave `corridax-upload-key.jks`;
5. senhas da chave, armazenadas separadamente;
6. este documento;
7. comprovantes/telas do Firebase App Distribution;
8. histórico futuro de versões, tags e hashes.

A chave privada `.jks` e suas senhas **não devem ser adicionadas ao GitHub**.

---

## 14. Nota jurídica

Este documento tem natureza de **registro técnico de desenvolvimento e anterioridade**.

Ele não substitui:

- Registro de Programa de Computador no INPI;
- Registro da marca CorridaX no INPI;
- contratos de titularidade ou cessão;
- termos de confidencialidade;
- outros instrumentos jurídicos eventualmente necessários.

---

**CorridaX — Beta 1.0.0**  
**Registro técnico elaborado em 24/08/2026**
