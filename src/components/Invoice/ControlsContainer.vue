<template>
  <section class="control-container">
    <button
      :disabled="isGenerating"
      class="generate-btn"
      @click="$emit('generateReport')"
    >
      {{ isGenerating ? "Loading..." : "Generate PDF" }}
    </button>

    <section class="progress-container">
      <div class="progress-bar">
        <div class="progress" :style="`width: ${progress}%;`" />
      </div>

      <section class="generating-label" v-if="progress !== 0">
        <span class="label-title">
          {{ progress === 100 ? "PDF Generated" : "Generating PDF" }}
        </span>

        <span class="label-progress">
          {{ `${progress} %` }}
        </span>
      </section>
    </section>
  </section>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  props: {
    progress: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    ...mapFields("invoiceModule", ["controlValue"]),

    isGenerating() {
      return this.progress !== 0 && this.progress !== 100;
    },
  },
};
</script>

<style lang="scss" scoped>
@mixin fadeintop($duration, $delay) {
  animation-name: animate-fade-in-top;
  animation-duration: $duration;
  animation-delay: $delay;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
}

.control-container {
  position: fixed;
  z-index: 999999;
  padding: 15px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 5px;
  right: 25px;
  top: 25px;
  width: 405px;
  box-shadow: 5px 5px 10px #000000;
  opacity: 0;
  max-height: calc(100vh - 50px);
  @include fadeintop(0.3s, 0.2s);

  .control-header {
    margin-bottom: 15px;
    padding-bottom: 5px;
    border-bottom: 1px solid #ccc;
  }

  .item-container {
    flex: 1 1 auto;
    overflow: auto;
    margin-bottom: 10px;

    .control-item {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;

      &:not(:last-child) {
        margin-bottom: 10px;
      }

      .control {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        padding-bottom: 5px;
        border-bottom: 1px solid #ccc;
        width: 100%;

        .item-label {
          margin-right: 15px;
          display: block;
          padding-bottom: 3px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .input-checkbox {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .input-box {
          flex: 1 1 auto;
          padding: 5px;
          border-radius: 3px;
          border: 1px solid white;
          width: 0;
        }
      }

      .options-container {
        width: 100%;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;

        .options-item {
          &:not(:last-child) {
            margin-bottom: 5px;
          }

          .options-title {
            margin-right: 10px;
            font-weight: 600;
          }

          .options-value {
            color: #3574b3;
          }
        }
      }
    }
  }

  .generate-btn {
    border: 0;
    padding: 15px 25px;
    border-radius: 5px;
    color: #fff;
    background: #243b55;
    transition: 0.3s;
    text-align: center;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
    }
  }

  .progress-container {
    width: 100%;
    margin-top: 10px;

    .progress-bar {
      width: 100%;
      height: 10px;
      border: 1px solid #585858;
      border-radius: 5px;
      margin-bottom: 5px;

      .progress {
        width: 0%;
        height: 100%;
        transition: 0.3s;
        background: #2c3e50;
      }
    }

    .generating-label {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
