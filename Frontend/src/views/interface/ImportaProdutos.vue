<template>
    <div id="importa-produtos">
        <vx-card title="Importação de Produtos">

            <div class="vx-row mb-6">
                <div class="vx-col w-full">
                    <div class="flex items-center">
                        <feather-icon icon="InfoIcon" svgClasses="h-5 w-5 mr-2" class="text-primary" />
                        <span class="text-sm">
                            Importe produtos através de um arquivo Excel (.xlsx ou .xls) com as colunas:
                            <strong>sku</strong>, <strong>descricao</strong> e <strong>etiqueta</strong>
                        </span>
                    </div>
                </div>
            </div>

            <div class="vx-row mb-6">
                <div class="vx-col w-full">
                    <vs-button color="success" type="gradient" icon-pack="feather" icon="icon-download"
                        @click="downloadTemplate">
                        Baixar Template Excel
                    </vs-button>
                </div>
            </div>

            <vs-divider />

            <div class="vx-row mt-6">
                <div class="vx-col w-full">
                    <h4 class="mb-4">Selecione o arquivo Excel para importar</h4>

                    <div class="upload-area" :class="{ 'dragover': isDragOver }" @dragover.prevent="isDragOver = true"
                        @dragleave.prevent="isDragOver = false" @drop.prevent="handleDrop">

                        <input type="file" ref="fileInput" @change="handleFileChange" accept=".xlsx,.xls"
                            style="display: none" />

                        <div v-if="!selectedFile" class="upload-content">
                            <feather-icon icon="UploadCloudIcon" svgClasses="h-16 w-16 mb-4" class="text-primary" />
                            <p class="text-lg mb-2">Arraste o arquivo aqui ou clique para selecionar</p>
                            <p class="text-sm text-grey">Apenas arquivos .xlsx ou .xls (máximo 10MB)</p>
                            <vs-button class="mt-4" color="primary" type="border" @click="$refs.fileInput.click()">
                                Selecionar Arquivo
                            </vs-button>
                        </div>

                        <div v-else class="file-selected">
                            <feather-icon icon="FileTextIcon" svgClasses="h-12 w-12 mb-2" class="text-success" />
                            <p class="text-lg font-semibold">{{ selectedFile.name }}</p>
                            <p class="text-sm text-grey mb-4">{{ formatFileSize(selectedFile.size) }}</p>
                            <div class="flex gap-2">
                                <vs-button color="danger" type="border" icon-pack="feather" icon="icon-x"
                                    @click="clearFile">
                                    Remover
                                </vs-button>
                                <vs-button color="primary" type="gradient" icon-pack="feather" icon="icon-upload"
                                    @click="uploadFile" :disabled="uploading">
                                    {{ uploading ? 'Importando...' : 'Importar Produtos' }}
                                </vs-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Progress Bar -->
            <div v-if="uploading" class="vx-row mt-6">
                <div class="vx-col w-full">
                    <vs-progress :percent="uploadProgress" color="primary">{{ uploadProgress }}%</vs-progress>
                </div>
            </div>

            <!-- Resultado da Importação -->
            <div v-if="importResult" class="vx-row mt-6">
                <div class="vx-col w-full">
                    <vx-card>
                        <div class="flex items-center mb-4">
                            <feather-icon :icon="importResult.erros === 0 ? 'CheckCircleIcon' : 'AlertCircleIcon'"
                                :svgClasses="importResult.erros === 0 ? 'h-6 w-6 mr-2 text-success' : 'h-6 w-6 mr-2 text-warning'" />
                            <h3>Resultado da Importação</h3>
                        </div>

                        <div class="stats-grid">
                            <div class="stat-item">
                                <p class="text-sm text-grey">Total de Linhas</p>
                                <p class="text-2xl font-bold">{{ importResult.total }}</p>
                            </div>
                            <div class="stat-item">
                                <p class="text-sm text-success">Importados com Sucesso</p>
                                <p class="text-2xl font-bold text-success">{{ importResult.sucesso }}</p>
                            </div>
                            <div class="stat-item">
                                <p class="text-sm text-danger">Erros</p>
                                <p class="text-2xl font-bold text-danger">{{ importResult.erros }}</p>
                            </div>
                        </div>

                        <!-- Detalhes dos Erros -->
                        <div v-if="importResult.detalhesErros && importResult.detalhesErros.length > 0" class="mt-6">
                            <vs-divider />
                            <h4 class="mb-4 text-danger">Detalhes dos Erros</h4>
                            <div class="error-list">
                                <div v-for="(erro, index) in importResult.detalhesErros" :key="index"
                                    class="error-item">
                                    <feather-icon icon="AlertTriangleIcon" svgClasses="h-4 w-4 mr-2 text-danger" />
                                    <div>
                                        <p><strong>Linha {{ erro.linha }}</strong>
                                            <span v-if="erro.sku"> - SKU: {{ erro.sku }}</span>
                                        </p>
                                        <p class="text-sm text-grey">{{ erro.erro }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </vx-card>
                </div>
            </div>

        </vx-card>
    </div>
</template>

<script>
import axios from 'axios'
import { backendUrl } from '@/globalComponents'

export default {
    name: 'ImportaProdutos',
    data() {
        return {
            selectedFile: null,
            isDragOver: false,
            uploading: false,
            uploadProgress: 0,
            importResult: null
        }
    },
    methods: {
        handleFileChange(event) {
            const file = event.target.files[0]
            this.validateAndSetFile(file)
        },
        handleDrop(event) {
            this.isDragOver = false
            const file = event.dataTransfer.files[0]
            this.validateAndSetFile(file)
        },
        validateAndSetFile(file) {
            if (!file) return

            const validExtensions = ['.xlsx', '.xls']
            const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()

            if (!validExtensions.includes(fileExtension)) {
                this.$vs.notify({
                    title: 'Arquivo Inválido',
                    text: 'Por favor, selecione apenas arquivos Excel (.xlsx ou .xls)',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                })
                return
            }

            if (file.size > 10 * 1024 * 1024) { // 10MB
                this.$vs.notify({
                    title: 'Arquivo muito grande',
                    text: 'O arquivo deve ter no máximo 10MB',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                })
                return
            }

            this.selectedFile = file
            this.importResult = null // Limpar resultado anterior
        },
        clearFile() {
            this.selectedFile = null
            this.$refs.fileInput.value = ''
            this.importResult = null
        },
        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes'
            const k = 1024
            const sizes = ['Bytes', 'KB', 'MB', 'GB']
            const i = Math.floor(Math.log(bytes) / Math.log(k))
            return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
        },
        async uploadFile() {
            if (!this.selectedFile) return

            this.uploading = true
            this.uploadProgress = 0
            this.importResult = null

            const formData = new FormData()
            formData.append('file', this.selectedFile)

            try {
                const response = await axios.post(`${backendUrl}/importaprodutos`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (progressEvent) => {
                        this.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    }
                })

                this.importResult = response.data

                this.$vs.notify({
                    title: 'Importação Concluída',
                    text: `${response.data.sucesso} produtos importados com sucesso!`,
                    color: response.data.erros === 0 ? 'success' : 'warning',
                    iconPack: 'feather',
                    icon: response.data.erros === 0 ? 'icon-check' : 'icon-alert-circle'
                })

                this.clearFile()

            } catch (error) {
                console.error('Erro ao importar:', error)
                this.$vs.notify({
                    title: 'Erro na Importação',
                    // LINHA CORRIGIDA (SINTAXE ANTIGA)
                    text: (error.response && error.response.data && error.response.data.error) || 'Erro ao processar o arquivo',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
            } finally {
                this.uploading = false
                this.uploadProgress = 0
            }
        },
        async downloadTemplate() {
            try {
                const response = await axios.get(`${backendUrl}/importaprodutos/template`, {
                    responseType: 'blob'
                })

                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', 'template_produtos.xlsx')
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)

                this.$vs.notify({
                    title: 'Download Iniciado',
                    text: 'Template Excel baixado com sucesso!',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
            } catch (error) {
                console.error('Erro ao baixar template:', error)
                this.$vs.notify({
                    title: 'Erro',
                    text: 'Erro ao baixar o template',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
            }
        }
    }
}
</script>

<style scoped>
.upload-area {
    border: 2px dashed #ccc;
    border-radius: 10px;
    padding: 40px;
    text-align: center;
    transition: all 0.3s;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.upload-area.dragover {
    border-color: #7367f0;
    background-color: rgba(115, 103, 240, 0.05);
}

.upload-content,
.file-selected {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.stat-item {
    padding: 20px;
    background: #f8f8f8;
    border-radius: 8px;
    text-align: center;
}

.error-list {
    max-height: 400px;
    overflow-y: auto;
}

.error-item {
    display: flex;
    align-items: flex-start;
    padding: 10px;
    border-left: 3px solid #ea5455;
    background: #fff5f5;
    margin-bottom: 10px;
    border-radius: 4px;
}

.gap-2 {
    gap: 0.5rem;
}
</style>
