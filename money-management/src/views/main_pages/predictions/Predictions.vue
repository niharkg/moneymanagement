<template>
  <div class="wrapper">
    <div class="container-fluid">
      <!-- Page-Title -->
      <div class="row">
        <div class="col-sm-12">
          <div class="page-title-box">
            <h4 class="page-title">Predictions</h4>
          </div>
        </div>
      </div>
      <div class="row">

        <!-- Prediction Donut Charts -->
        <div v-for="(cat) in categories" class="col-sm-3">
          <router-link :to="{name:'transactions', query:{category: cat}}" style="color: #505050">
            <div class="card-box" v-bind:class="cat">
              <div v-bind:id="cat + '_percent'" style="width: 100%; position: absolute; top: 55%; left: 0; margin-top: -20px; line-height:19px; text-align: center; z-index: 999999999999999; font-size: 24px; ">
              </div>
              <canvas v-bind:id="cat" style="width: 100%; height: 250px;"></canvas>
            </div>
          </router-link>
        </div>
        <!-- End Prediction Donut Charts -->

      </div>
    </div>
    <!-- end container -->
  </div>
</template>
+
<script>
import { mapGetters } from "vuex";
// import Chart from 'chart.js'

export default {
  name: "Predictions",
  data() {
    return {
      categories: [],
    };
  },
  computed: {
    ...mapGetters({
      is_login: "is_login",
      me: "me",
      transactions: "transactions"
    })
  },
  methods: {
    createLineGraph(spend_data, pred_data, category){
      const ctx = document.getElementById(category);
      const myChart = new Chart(ctx, {
        title: category,
        type: 'line',
        data: {
          labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          datasets: [
            {
              type: 'bubble',
              label: "Actual Spendings",
              backgroundColor: "#017DD7",
              data: spend_data,
              fill: false,
              showLines: false,
              pointRadius: 6,
            },
            {
              type: 'line',
              label: "Baseline Spendings",
              backgroundColor: "#FE0000",
              borderColor: "#FE0000",
              data: pred_data,
              fill: false,
              lineTension: 0,
              showLines: true,
              spanGaps: true,
              pointRadius: 0,
            }
          ]
        },
        options: {
          scales: {
            yAxes: [{
              display: true,
              ticks: {
                suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                beginAtZero: true   // minimum value will be 0.
              }
            }],
            xAxes: [{
              display: true,
            }]
          },
          title: {
            display: true,
            text: category,
            fontSize: 18,
          },
          legend: {
            display: true,
          }
        }
      });
    },
    createDonutChart(current_spending, predicted_spending, category) {
      let ctx = document.getElementById(category);
      let percent = ((current_spending/predicted_spending) * 100).toFixed(1);
      let color = this.getDonutColor(percent);
      let percent_div = document.getElementById(category+'_percent');
      percent_div.innerHTML = percent + "%"
      let diff = (current_spending-predicted_spending).toFixed(2)
      let percent_nonspent = (100-percent).toFixed(1)
      if (percent_nonspent < 0) {
        percent_nonspent = 0;
      }
      let text_str = ""
      if (diff >= 0) {
        text_str = ": +$" + Math.abs(diff)
      }
      else {
        text_str = ": -$" + Math.abs(diff)
      }
      const myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ["Percent of prediction spent", "Percent of prediction not spent"],
          datasets: [
            {
              backgroundColor: [color, "#D3D3D3"],
              data: [percent, percent_nonspent],
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: category + text_str,
            fontSize: 16,
          },
          legend: {
            display: false,
          },
          animation:{
            onComplete : function(){
              // Draw percentatge here
            }
          },
        }
      });
    },
    getDonutColor(percent) {
      let threshold = 3;
      if (100 - percent >= threshold) {
        return "#00FF7F";
      }
      if (percent - 100 >= threshold) {
        return "#D22F2F";
      }
      return "#004879";
    },
    getMonth(month) {
      switch(Number(month)) {
        case 1:
          return "January";
        case 2:
          return "February";
        case 3:
          return "March";
        case 4:
          return "April";
        case 5:
          return "May";
        case 6:
          return "June";
        case 7:
          return "July";
        case 8:
          return "August";
        case 9:
          return "September";
        case 10:
          return "October";
        case 11:
          return "November";
        case 12:
          return "December";
      }
    },
    trainAllModels(){
      this.$store.dispatch("getUserCategories", this.me.user_id).then(result => {
        this.categories = result
        let params = {}
        params.user_id = this.me.user_id
        for(let category of this.categories) {
          params.category = category;
          this.$store.dispatch("getCategoryPredictions", params).then(result => {
            console.log(result)
            let months = result[0]
            let spendings = result[1]
            let predictions = result[2]
            let spend_data = []
            let pred_data = []
            // Get data into scatter plot format
            for (let i in months) {
              spend_data.push({x: this.getMonth(months[i]), y: spendings[i]});
              pred_data.push({x: this.getMonth(months[i]), y: predictions[i]});
            }
            this.createLineGraph(spend_data, pred_data, category);
          });
        }
      });
    },
    calculatePrediction(all_models, cat, month) {
      for(let i in all_models){
        if(all_models[i]["category"] == cat) {
          return (month*all_models[i]["slope"]) + all_models[i]["intercept"]
        }
      }
    }
  },
  // Call these functions before the page loads (mounts)
  beforeMount(){
    this.$store.dispatch("getAllModels", this.me.user_id).then(result => {
      let all_models = result;
      console.log(all_models);
      if(result.length == 0){
        this.trainAllModels();
      }
      else {
        var d = new Date();
        let month = d.getMonth();
        let year = d.getFullYear();
        this.$store.dispatch("getUserCategories", this.me.user_id).then(result => {
          this.categories = result;
          console.log(this.categories);
          const params = {
            month : month,
            year : year
          }
          this.$store.dispatch("getCurrentMonthCategorySpendings", params).then(result => {
            let categorySpendings = result;
            let months = Object.keys(categorySpendings)
            for(let cat of this.categories) {
              this.createDonutChart(categorySpendings[months[0]][cat], this.calculatePrediction(all_models, cat, month), cat);
            }
          });
        });

      }


    });

  },
  created() {

  },
  mounted() {

  },
};
</script>

<style scoped>
.card-box-no-outline {
  padding: 20px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin-bottom: 20px;
  background-color: #ffffff;
}
</style>
