import React, { useState, useEffect } from "react"
import {
  ChakraProvider,
  Box,
  Grid,
  theme,
  Input,
  InputGroup,
  GridItem,
  Image,
  Text,
  Button,
  Stack
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"



export const App = () => { 

  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      const params = encodeURI(query)
      fetch('https://yt-dl-server.highintoxic.repl.co/query?q=' + params)
        .then(res => res.json())
        .then(res => {
          setLoading(false)
          setResults([...res])
        })
        .catch(e => e)
    }, 1000)
    
    return () => {
      clearTimeout(timeoutID)
    }
  }, [query])


  const onAudioClick = (id, name) => {
    name = name.replace('|','').toString('ascii')
    console.log(id)
    fetch('https://yt-dl-server.highintoxic.repl.co/download?id=' + encodeURI(id),{
      mode: 'no-cors',
      method: "get",
      headers: {
        'Content-Disposition': `attachment; filename="${name}.mp3"`,
        "Content-Type": "audio/mpeg"
      }
    })
      .then(res => res.blob())
      .then(blob => {
        // 2. Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', name + '.mp3');
        // 3. Append to html page
        document.body.appendChild(link);
        // 4. Force download
        link.click();
        // 5. Clean up and remove the link
        link.parentNode.removeChild(link);
      })
  }
  
  const ResultRender = () => {
    if(query === '' || !query) return (<p>A search query is required.</p>)
    if(loading === true) return (<p>Loading...</p>)
    if(results === []) return (<p>Loading...</p>)
    if(typeof results === "undefined") return (<p>Loading...</p>)
    else return (
      results.map(r => (
      <Box boxSize="sm" w="100%" bg="#318097" borderWidth="1px" borderRadius="lg" overflow="hidden" h="min-content" display="flex" flexDirection="row">
        <Image src={`https://img.youtube.com/vi/${r.id}/0.jpg`} alt="Loading..." w="20%" rounded="md" justifySelf="left" fit="contain"  />
        <Grid flex="auto" templateRows="30% 70%">
          <GridItem rowStart={1} rowEnd={2} justifySelf="center" alignSelf="center">
            <Text fontSize="lg" isTruncated>{r.title}</Text>
          </GridItem>
          <GridItem rowStart={2} rowEnd={3} justifySelf="center" alignSelf="center">
            <Stack spacing="0.5rem" direction="row" align="center">
              <Button colorScheme="teal" w="7rem" size="sm" onClick={() => onAudioClick(r.url, r.title)}>MP3 - Audio</Button>
              <Button colorScheme="teal" w="7rem" size="sm">MP4 - Video</Button>
            </Stack>
          </GridItem>
        </Grid>
      </Box>
      ))
    )



  }

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3} templateColumns="repeat(12, 1fr)" templateRows="repeat(12, auto)">
          <GridItem colStart={12} colEnd={13} display="flex" alignItems="flex-start" justifyContent="flex-end">
            <ColorModeSwitcher />
          </GridItem>
          <GridItem colStart={3} colEnd={11} rowStart={1} rowEnd={2} display="flex" alignItems="center" justifyContent="center">
            <InputGroup>
              <Input size="lg" placeholder="Search..." alignSelf="center" justifySelf="center" isRequired value={query} onChange={(e) => setQuery(e.target.value)} />
            </InputGroup>
          </GridItem>
          <GridItem colStart={3} colEnd={11} rowStart={2} rowEnd={13} rowSpan='auto' >
            <Box p="0.5rem" color="white" mt="4" bg="teal.500" rounded="md" shadow="md" display="flex" flexDirection="column">
              <ResultRender />
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </ChakraProvider>
  )
}