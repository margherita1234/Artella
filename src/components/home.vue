<template>
  <div class="home__desc">
  <h1 class="h1__big">Tendenza</h1>
  <h3>Scopri le opere più valutate</h3>
  </div>
  <div class="container__home__gene" v-for="(gene, index) in this.arrayGeneRes" :key="gene.id">
    <h1 style="margin-left: 10vw;">{{ this.ArrayGenes[index] }}</h1>
    <v-skeleton-loader
          v-if="this.arrayGeneRes[index] == 0"
          type="list-item-avatar"
        ></v-skeleton-loader>
    <v-sheet class="mx-auto">
      <v-slide-group v-model="model" class="pa-4" selected-class="bg-success" show-arrows>
        <v-slide-group-item v-for="artwork in this.arrayGeneRes[index]" :key="artwork.link" v-slot="{ isSelected, toggle, selectedClass }">
          <div class="ods__card ods__card__little" @click="$router.push({ path: '/opera:' + artwork.title__intero})"
            :style="{ backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(201, 201, 201, 0.73)), url(' + artwork.image + ')' }">
            <div class="ods__card__inside">
              <div class="ods__card__inside__uno">
                <div>
                </div>
                <h3>{{ artwork.title }}</h3>
              </div>
              <div class="ods__card__inside__due">
              </div>
            </div>
          </div>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
  </div>
</template>

<script>

import DataService from "../dataservice";
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

export default {

  data() {
    return {
      arrayGeneRes:[[],[],[]],
      ArrayGenes:["Impressionism", "pop-art", "Pictorialism"]
    }
  },
  watch: {

  },
  methods: {
    async geneSearch() {
      for (let i = 0; i < this.ArrayGenes.length; i++) {
        try {
          const response = await DataService.getGene(this.ArrayGenes[i]);
          
          this.arrayGeneRes[i] = response.data._embedded.results.map((result) => (
          {
            id: result._links.self.href.replace("https://www.artsy.net/artwork/", ""),
            title: result.title,
            desc: result.description,
            type: result.type,
            image: result._links.thumbnail.href,
            style: this.ArrayGenes[i],
            title__intero: result._links.permalink.href.replace("https://www.artsy.net/artwork/", ""),
          })
        );

        } catch (error) {
          console.error(error);
        }

      }
    },
    async checkArt(art){
      await console.log((await DataService.getGene(art)).data.total_count)
/*           if(DataService.getGene(art.title__intero).total_count >0){
            this.arrayGeneRes[i].push({
              id: element._links.self.href.replace("https://www.artsy.net/artwork/", ""),
              title: element.title,
              desc: element.description,
              type: element.type,
              image: element._links.thumbnail.href,
              style: this.ArrayGenes[i],
              title__intero: element._links.permalink.href.replace("https://www.artsy.net/artwork/", ""),
            })
          } */
    }
  },

  mounted() {
    this.geneSearch()
  },
}
</script>

<style>

.home__desc{
  margin: 6vh 10vw 6vh 10vw; 
}

.mx-auto {
  width: 90vw;
}
</style>
